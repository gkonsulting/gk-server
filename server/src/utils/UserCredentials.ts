import {
    Field,
    InputType
} from "type-graphql";

@InputType()
export class UserCredentials {
    @Field()
    email: string;
    @Field()
    username: string;
    @Field()
    password: string;
}
