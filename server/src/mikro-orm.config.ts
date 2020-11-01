import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Weight } from "./enitities/Weight";
import path from 'path'
import { User } from "./enitities/User";
export default {
    migrations:{
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Weight, User],
    dbName: 'healthdb',
    user: 'ianevangelista',
    type: 'postgresql',
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];