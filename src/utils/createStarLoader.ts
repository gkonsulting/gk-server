import { Star } from "../enitities/Star";
import DataLoader from "dataloader";

// [{movieId: 5, userId: 10}]
// [{movieId: 5, userId: 10, value: 1}]
export const createStarLoader = () =>
    new DataLoader<{ movieId: number; userId: number }, Star | null>(
        async (keys) => {
            const stars = await Star.findByIds(keys as any);
            const starIdtoStar: Record<string, Star> = {};
            stars.forEach((star) => {
                starIdtoStar[`${star.userId}|${star.movieId}`] = star;
            });

            return keys.map(
                (key) => starIdtoStar[`${key.userId}|${key.movieId}`]
            );
        }
    );
