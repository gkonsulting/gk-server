import { UserCredentials } from "./UserCredentials";

export const validateRegister = (options: UserCredentials) => {
    let mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!options.email.match(mailformat)) {
        return [
            {
                field: "email",
                message: "Invalid email-format",
            },
        ];
    }
    if (options.username.length < 3) {
        return [
            {
                field: "username",
                message: "Username must be at least three characters",
            },
        ];
    }
    if (options.username.includes("@")) {
        return [
            {
                field: "username",
                message: "Username cannot include @",
            },
        ];
    }
    if (options.password.length < 3) {
        return [
            {
                field: "password",
                message: "Password must be at least three characters",
            },
        ];
    }
    return null;
};
