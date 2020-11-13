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
require("dotenv").config();

const main = async () => {
    const conn = await createConnection({
        type: "postgres",
        host: process.env.HOSTNAME,
        url: process.env.URL,
        database: process.env.DATABASE,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        ssl: true,
        extra: {
            ssl: {
                rejectUnauthorized: false,
            },
        },
        port: 5432,
        logging: true,
        synchronize: true,
        entities: [Movie, User],
        migrations: [path.join(__dirname, "./migrations/*")],
    });
    await conn.runMigrations();
    const app = express();
    const RedisStore = connectRedis(session);
    const redis = new Redis({
        port: parseInt(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
        family: 4,
        password: process.env.REDIS_PASSWORD,
    });
    app.use(
        cors({
            origin: process.env.CORS_ORIGIN,
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
            secret: process.env.SECRET, //krypterer userid key, express session setter cookie, req sender cookie, server dekrypterer, req til redis og får value userid
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

    const port = process.env.PORT || 4000;
    app.listen(port, () => {
        console.log(`Server starterd on port ${port}`);
    });
};
main().catch((err) => {
    console.error(err);
});
