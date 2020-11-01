import { Weight } from '../enitities/Weight';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { MyContext } from '../types';


@Resolver()
export class WeightResolver {
    @Query(()=> [Weight])
    getWeights(@Ctx() ctx: MyContext): Promise<Weight[]>{                
        return ctx.em.find(Weight, {})
    }

    @Query(()=>Weight)
    getOne(@Arg('id') id: number, @Ctx() {em}: MyContext): Promise<Weight | null>{
        return em.findOne(Weight, {id});
    }

    @Mutation(()=>Weight)
    async createWeight(@Arg('weight') weight: number, @Ctx() {em}: MyContext): Promise<Weight>{
        const newWeight = em.create(Weight, {weight: weight});
        await em.persistAndFlush(newWeight);
        return newWeight;
    }

    @Mutation(()=>Weight, {nullable: true})
    async updateWeight(@Arg('id') id: number, @Arg('weight') newWeight: number, @Ctx() {em}: MyContext): Promise<Weight | null>{
        const weight = await em.findOne(Weight, {id})
        if(!weight) return null;
        if(typeof weight !== 'undefined') {
            weight.weight = newWeight;
            await em.persistAndFlush(weight);
        }
        return weight
    }

    @Mutation(()=> Boolean)
    async deleteWeight(@Arg('id') id: number, @Ctx() {em}: MyContext): Promise<boolean>{
        try{
            await em.nativeDelete(Weight, {id})
            return true
        }
        catch{
            return false
        }
    }
}