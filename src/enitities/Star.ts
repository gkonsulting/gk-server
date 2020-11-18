import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import { User } from "./User";
import { Movie } from "./Movie";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Star extends BaseEntity {
    @Field()
    @Column({ type: "int" })
    value: number;

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User, (user) => user.stars)
    user: User;

    @PrimaryColumn()
    movieId: number;

    @ManyToOne(() => Movie, (movie) => movie.stars, {
        onDelete: "CASCADE",
    })
    movie: Movie;
}
