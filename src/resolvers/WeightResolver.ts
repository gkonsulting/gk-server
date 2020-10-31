import { Weight } from '../enitities/Weight';
import { Ctx, Query, Resolver } from 'type-graphql';
import { MyContext } from '../types';


@Resolver()
export class WeightResolver {
    @Query(()=> [Weight])
    async weights(@Ctx() ctx: MyContext): Promise<Weight[]>{                
        return ctx.em.find(Weight, {})
    }

    


    
}