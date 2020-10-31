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
    getOne(@Arg('id') id: number, @Ctx() ctx: MyContext): Promise<Weight | null>{
        return ctx.em.findOne(Weight, {id});
    }

    @Mutation(()=>Weight)
    async createWeight(@Arg('weight') weight: number, @Ctx() ctx: MyContext): Promise<Weight>{
        const newWeight = ctx.em.create(Weight, {weight: weight});
        await ctx.em.persistAndFlush(newWeight);
        return newWeight;
    }

    @Mutation(()=>Weight, {nullable: true})
    async updateWeight(@Arg('id') id: number, @Arg('weight') newWeight: number, @Ctx() ctx: MyContext): Promise<Weight | null>{
        const weight = await ctx.em.findOne(Weight, {id})
        if(!weight) return null;
        if(typeof weight !== 'undefined') {
            weight.weight = newWeight;
            await ctx.em.persistAndFlush(weight);
        }
        return weight
    }

    @Mutation(()=> Boolean)
    async deleteWeight(@Arg('id') id: number, @Ctx() ctx: MyContext): Promise<boolean>{
        try{
            await ctx.em.nativeDelete(Weight, {id})
            return true
        }
        catch{
            return false
        }
    }
}