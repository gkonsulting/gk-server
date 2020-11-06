import React from "react";
import { Form, Formik } from "formik";
import { Button } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { Navbar } from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
    const [, login] = useLoginMutation();
    const router = useRouter();
    return (
        <>
            <Navbar />
            <Wrapper variant="small">
                <Formik
                    initialValues={{ username: "", password: "" }}
                    onSubmit={async (values, { setErrors }) => {
                        const res = await login({ options: values });
                        if (res.data?.login.errors)
                            setErrors(toErrorMap(res.data.login.errors));
                        else if (res.data?.login.user) router.push("/");
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
                                Login
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(Login);
