import { MikroORM } from "@mikro-orm/core/MikroORM";
import { __prod__ } from "./constants";
import { Weight } from "./enitities/Weight";
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();
    
    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver],
            validate: false
        })
    });

    apolloServer.applyMiddleware({ app })
    
    app.listen(4000, ()=>{
        console.log('Server starterd on localhost:4000')
    })

    
    
}
main().catch((err)=>{
    console.error(err);
});