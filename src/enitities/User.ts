import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Movie } from "./Movie";
import { Star } from "./Star";
import { Vote } from "./Vote";
import { Response } from "./Response";
import { Event } from "./Event";

//Lager entitet og objekttype
@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field()
    @Column({ unique: true })
    username!: string;

    @Field()
    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Field(() => String, { nullable: true })
    secret!: string;

    @OneToMany(() => Movie, (movie) => movie.creator)
    movies: Movie[];

    @OneToMany(() => Event, (event) => event.creator)
    events: Event[];

    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Vote[];
    
    @OneToMany(() => Star, (star) => star.user)
    stars: Star[];

    @OneToMany(() => Response, (response) => response.user)
    responses: Response[];
}
