import { Vote } from "../enitities/Vote";
import DataLoader from "dataloader";

// [{movieId: 5, userId: 10}]
// [{movieId: 5, userId: 10, value: 1}]
export const createVoteLoader = () =>
    new DataLoader<{ movieId: number; userId: number }, Vote | null>(
        async (keys) => {
            const votes = await Vote.findByIds(keys as any);
            const voteIdtoVote: Record<string, Vote> = {};
            votes.forEach((vote) => {
                voteIdtoVote[`${vote.userId}|${vote.movieId}`] = vote;
            });

            return keys.map(
                (key) => voteIdtoVote[`${key.userId}|${key.movieId}`]
            );
        }
    );
