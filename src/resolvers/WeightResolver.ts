import { Weight } from '../enitities/Weight';
import { Ctx, Query, Resolver } from 'type-graphql';
import { MyContext } from '../types'

@Resolver()
export class WeightResolver {
    @Query(()=> [Weight])
    weights(@Ctx() {em}: MyContext): Promise<Weight[]>{
        return em.find(Weight, {});
    }
}