import { Entity, BaseEntity, ManyToOne, PrimaryColumn, Column } from "typeorm";
import { User } from "./User";
import { Movie } from "./Movie";

// m to n
// many to many
// user <-> movies
// user -> join table <- movies
// user -> updoot <- movies

@Entity()
export class Vote extends BaseEntity {
    @Column({ type: "int" })
    value: number;

    @PrimaryColumn()
    userId: number;

    @ManyToOne(() => User, (user) => user.votes)
    user: User;

    @PrimaryColumn()
    movieId: number;

    @ManyToOne(() => Movie, (movie) => movie.votes, {
        onDelete: "CASCADE",
    })
    movie: Movie;
}
