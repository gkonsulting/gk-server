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
import { Response } from "./Response";
//Lager entitet og objekttype
@ObjectType()
@Entity()
export class Event extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => String)
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;

    @Field(() => String, { nullable: true })
    @Column()
    title!: string;

    @Field(() => String)
    @Column()
    date!: string;
    
    @Field(() => String)
    @Column()
    address!: string;

    @Field()
    @Column()
    creatorId: number;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.events)
    creator: User;

    @Field()
    @Column()
    description!: string;

    @Field()
    @Column()
    thumbnail!: string;
    
    @OneToMany(() => Response, (response) => response.event)
    responses: Response[];

    @Field(() => Int, { nullable: true })
    responseStatus: number | null; // 1 or -1 or null
}
