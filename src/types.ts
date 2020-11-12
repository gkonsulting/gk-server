import { Request, Response } from "express";
import { Redis } from "ioredis";
export type MyContext = {
    res: Response;
    req: Request & { session?: Express.Session };
    redis: Redis;
};
