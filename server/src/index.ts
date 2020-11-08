import { COOKIE_NAME, __prod__ } from "./constants";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from "cors";
import { MovieResolver } from "./resolvers/MovieResolver";
import { createConnection } from "typeorm";
import { Movie } from "./enitities/Movie";
import { User } from "./enitities/User";
import path from "path";
const main = async () => {
    const conn = await createConnection({
        type: "postgres",
        database: "gk",
        username: "ianevangelista",
        logging: true,
        synchronize: true,
        entities: [Movie, User],
        migrations: [path.join(__dirname, "./migrations/*")],
    });
    await conn.runMigrations();
    const app = express();
    const RedisStore = connectRedis(session);
    const redis = new Redis();
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        })
    );

    // Session med express og redis, redis er in-memory datastruktur(dict/hashmap)
    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redis,
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

    // Apolloserver setup, lager schema med resolvers
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [MovieResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ req, res, redis }),
    });

    // Middleware
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
