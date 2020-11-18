import { Field, Int, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Star } from "./Star";
import { User } from "./User";
import { Vote } from "./Vote";

//Lager entitet og objekttype
@ObjectType()
@Entity()
export class Movie extends BaseEntity {
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
    @Column()
    title!: string;

    @Field()
    @Column()
    creatorId: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.movies)
    creator: User;

    @Field()
    @Column()
    description!: string;

    @Field()
    @Column()
    poster!: string;

    @Field()
    @Column()
    reason!: string;

    @Field()
    @Column()
    rating!: string;

    @OneToMany(() => Vote, (vote) => vote.movie)
    votes: Vote[];

    @Field()
    @Column({ type: "int", default: 0 })
    points!: number;

    @Field(() => Int, { nullable: true })
    voteStatus: number | null; // 1 or -1 or null

    @OneToMany(() => Star, (star) => star.movie)
    stars: Star[];

    @Field(() => Int, { nullable: true })
    @Column({ type: "int", default: 0 })
    userStars: number | null;

    @Field()
    @Column({ type: "decimal", default: 0 })
    totalStars!: number;

    @Field(() => Int, { nullable: true })
    starStatus: number | null;

    @Field(() => Boolean, { nullable: true })
    @Column({ type: "boolean", default: false })
    seen!: boolean;
}
