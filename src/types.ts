import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createResponseLoader } from "./utils/createResponseLoader";
import { createStarLoader } from "./utils/createStarLoader";
import { createUserLoader } from "./utils/createUserLoader";
import { createVoteLoader } from "./utils/createVoteLoader";
export type MyContext = {
    res: Response;
    req: Request & { session?: Express.Session };
    redis: Redis;
    userLoader: ReturnType<typeof createUserLoader>;
    voteLoader: ReturnType<typeof createVoteLoader>;
    starLoader: ReturnType<typeof createStarLoader>;
    responseLoader: ReturnType<typeof createResponseLoader>;
};
