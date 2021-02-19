import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import { User } from "./User";
import { Event } from "./Event";
import { Field } from "type-graphql";

@Entity()
export class Response extends BaseEntity {
    @Column({ type: "int" })
    value: number;

    @PrimaryColumn()
    userId: number;

    @Field()
    username: string;

    @Field(()=> User)
    @ManyToOne(() => User, (user) => user.responses)
    user: User;

    @PrimaryColumn()
    eventId: number;

    @ManyToOne(() => Event, (event) => event.responses, {
        onDelete: "CASCADE",
    })
    event: Event;
}
