import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import path from 'path'
import { User } from "./enitities/User";
import { Movie } from "./enitities/Movie";


// mikro-orm config file to setup db and migrations-queries to db
export default {
    migrations:{
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Movie, User],
    dbName: 'gkdb',
    user: 'ianevangelista',
    type: 'postgresql',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];