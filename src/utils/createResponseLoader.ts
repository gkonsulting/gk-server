import { Response } from "../enitities/Response";
import DataLoader from "dataloader";


export const createResponseLoader = () =>
    new DataLoader<{ eventId: number; userId: number }, Response | null>(
        async (keys) => {
            const responses = await Response.findByIds(keys as any);
            const responseIdtoResponse: Record<string, Response> = {};
            responses.forEach((response) => {
                responseIdtoResponse[`${response.userId}|${response.eventId}`] = response;
            });

            return keys.map(
                (key) => responseIdtoResponse[`${key.userId}|${key.eventId}`]
            );
        }
    );
