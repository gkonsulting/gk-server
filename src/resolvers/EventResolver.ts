import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    InputType,
    Int,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root,
    UseMiddleware,
} from "type-graphql";
import { MyContext } from "../types";
import { isAuth } from "../enitities/middleware/isAUth";
import { getConnection } from "typeorm";
import { User } from "../enitities/User";
import { Response } from "../enitities/Response";
import { Event } from "../enitities/Event";

//Resolver for queries med graphql
@InputType()
class EventInput {
    @Field()
    title: string;
    @Field()
    date: string;
    @Field()
    address: string;
    @Field()
    description: string;
    @Field()
    thumbnail: string;
}

@ObjectType()
class PaginatedEvents {
    @Field(() => [Event])
    events: Event[];
    @Field()
    hasMore: boolean;
}

@Resolver(Event)
export class EventResolver {
    @FieldResolver(() => User)
    creator(@Root() event: Event, @Ctx() { userLoader }: MyContext) {
        return userLoader.load(event.creatorId);
    }

    @FieldResolver(() => Int, { nullable: true })
    async responseStatus(
        @Root() event: Event,
        @Ctx() { responseLoader, req }: MyContext
    ) {
        if (!req.session?.userId) {
            return null;
        }

        const response = await responseLoader.load({
            eventId: event.id,
            userId: req.session.userId,
        });

        return response ? response.value : null;
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async response(
        @Arg("eventId", () => Int) eventId: number,
        @Arg("value", () => Int) value: number,
        @Ctx() { req }: MyContext
    ) {
        const isResponse = value !== -1;
        const realValue = isResponse ? 1 : -1;
        const { userId } = req.session!;

        const response = await Response.findOne({ where: { eventId, userId } });

        // the user has voted on the event before
        // and they are changing their vote
        if (response && response.value !== realValue) {
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
                    update response
                    set value = $1
                    where "eventId" = $2 and "userId" = $3
                        `,
                    [realValue, eventId, userId]
                );
            });
        } else if (!response) {
            // has never voted before
            await getConnection().transaction(async (tm) => {
                await tm.query(
                    `
                insert into response ("userId", "eventId", value)
                values ($1, $2, $3)
                    `,
                    [userId, eventId, realValue]
                );
            });
        }
        return true;
    }

    @Query(() => PaginatedEvents)
    async getEvents(
        @Arg("limit", () => Int) limit: number,
        @Arg("cursor", () => String, { nullable: true }) cursor: string | null
    ): Promise<PaginatedEvents> {
        const realLimit = Math.min(50, limit);
        const realLimitPlusOne = realLimit + 1;
        const replacements: any[] = [realLimitPlusOne];
        if (cursor) {
            replacements.push(new Date(parseInt(cursor)));
        }

        const events = await getConnection().query(
            `
          select e.*
          from event e
          ${cursor ? `where e."createdAt" < $2` : ``}
          order by e."createdAt" DESC
          limit $1
          `,
            replacements
        );        

        return {
            events: events.slice(0, realLimit),
            hasMore: events.length === realLimitPlusOne,
        };
    }

    @Query(() => Event, { nullable: true })
    @UseMiddleware(isAuth)
    async getEvent(
        @Arg("id", () => Int!) id: number
    ): Promise<Event | undefined> {
        return Event.findOne(id);
    }

    @Mutation(() => Event)
    @UseMiddleware(isAuth)
    async addEvent(
        @Arg("input") input: EventInput,
        @Ctx() { req }: MyContext
    ): Promise<Event> {
        return Event.create({
            ...input,
            creatorId: req.session?.userId,
        }).save();
    }

    @Mutation(() => Event, { nullable: true })
    @UseMiddleware(isAuth)
    async updateEvent(
        @Arg("id", () => Int) id: number,
        @Arg("input") input: EventInput,
        @Ctx() { req }: MyContext
    ): Promise<Event | undefined> {
        const result = await getConnection()
            .createQueryBuilder()
            .update(Event)
            .set(input)
            .where('id = :id and "creatorId" = :creatorId', {
                id,
                creatorId: req.session!.userId,
            })
            .returning("*")
            .execute();

        console.log(result);

        return result.raw[0];
    }

    @Mutation(() => Boolean)
    @UseMiddleware(isAuth)
    async deleteEvent(
        @Arg("id", () => Int) id: number,
        @Ctx() { req }: MyContext
    ): Promise<boolean> {
        try {
            await Event.delete({ id, creatorId: req.session!.userId });
            return true;
        } catch {
            return false;
        }
    }
}
