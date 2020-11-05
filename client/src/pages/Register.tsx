import React from "react";
import { Form, Formik } from "formik";
import { Button } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
    const [, regiserUser] = useRegisterMutation();
    const router = useRouter();
    return (
        <Wrapper variant="small">
            <DarkModeSwitch />
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const res = await regiserUser(values);
                    if (res.data?.registerUser.errors)
                        setErrors(toErrorMap(res.data.registerUser.errors));
                    else if (res.data?.registerUser.user) router.push("/");
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="Username"
                            label="Username"
                        />
                        <InputField
                            name="password"
                            placeholder="Password"
                            label="Password"
                            type="password"
                        />
                        <Button
                            mt={4}
                            isLoading={isSubmitting}
                            type="submit"
                            variantColor="teal"
                        >
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default Register;
