import { MikroORM } from "@mikro-orm/core/MikroORM";
import { __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { WeightResolver } from "./resolvers/WeightResolver";
import { UserResolver } from "./resolvers/UserResolver";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();
    //const weight = orm.em.create(Weight, {weight: 60});
    //await orm.em.persistAndFlush(weight);
    //const weights = await orm.em.find(Weight, {});
    //console.log(weights);

    const app = express();
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );
    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
                disableTTL: true,
            }),
            secret: "keyboard cat", //krypterer userid key, express session setter cookie, req sender cookie, server dekrypterer, req til redis og får value userid
            resave: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 år
                httpOnly: true, // gir ikke tilgang til cookie
                sameSite: "lax", // csrf
                secure: __prod__, // hvis true funker det bare i https
            },
            saveUninitialized: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [WeightResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    });

    apolloServer.applyMiddleware({
        app,
        cors: { origin: false },
    });

    app.listen(4000, () => {
        console.log("Server starterd on port 4000");
    });
};
main().catch((err) => {
    console.error(err);
});
