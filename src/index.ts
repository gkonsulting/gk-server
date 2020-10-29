import { MikroORM } from "@mikro-orm/core/MikroORM";
import { __prod__ } from "./constants";
import mikroConfig from './mikro-orm.config';
import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { WeightResolver } from "./resolvers/WeightResolver";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();
    
    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [WeightResolver],
            validate: false
        }),
        context: () => {{ em: orm.em  }}
    });

    apolloServer.applyMiddleware({ app })
    
    app.listen(4000, ()=>{
        console.log('Server starterd on localhost:4000')
    })

    
    
}
main().catch((err)=>{
    console.error(err);
});