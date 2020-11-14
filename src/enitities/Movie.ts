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
}
