import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response, Session } from "express";
export type MyContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
    res: Response;
    req: Request & { session?: Express.Session };
};
