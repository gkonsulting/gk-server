import { MikroORM } from "@mikro-orm/core/MikroORM";
import { __prod__ } from "./constants";
import mikroConfig from './mikro-orm.config';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { WeightResolver } from "./resolvers/WeightResolver";
import { UserResolver } from "./resolvers/UserResolver";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();
    //const weight = orm.em.create(Weight, {weight: 60});
    //await orm.em.persistAndFlush(weight);
    //const weights = await orm.em.find(Weight, {});
    //console.log(weights);    
    
    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [WeightResolver, UserResolver],
            validate: false
        }),
        context: orm,
    });

    apolloServer.applyMiddleware({ app })
    
    app.listen(4000, ()=>{
        console.log('Server starterd on port 4000')
    })
}
main().catch((err)=>{
    console.error(err);
});