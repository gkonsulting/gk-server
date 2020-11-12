import React from "react";
import { Form, Formik } from "formik";
import { Button, Flex, Link } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { Navbar } from "../components/Navbar";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";
const Login: React.FC<{}> = ({}) => {
    const [login] = useLoginMutation();
    const router = useRouter();
    return (
        <>
            <Navbar />
            <Wrapper variant="small">
                <Formik
                    initialValues={{ usernameOrEmail: "", password: "" }}
                    onSubmit={async (values, { setErrors }) => {
                        const res = await login({
                            variables: {
                                usernameOrEmail: values.usernameOrEmail,
                                password: values.password,
                            },
                            update: (cache, { data }) => {
                                cache.writeQuery<MeQuery>({
                                    query: MeDocument,
                                    data: {
                                        __typename: "Query",
                                        me: data?.login.user,
                                    },
                                });
                                cache.evict({ fieldName: "getMovies" });
                            },
                        });
                        if (res.data?.login.errors)
                            setErrors(toErrorMap(res.data.login.errors));
                        else if (res.data?.login.user) {
                            if (typeof router.query.next === "string")
                                // sjekker om man har prøvd å gjøre noe når man ikke er logget inn, blir sendt tilbake
                                router.push(router.query.next);
                            else router.push("/");
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField
                                name="usernameOrEmail"
                                placeholder="Username/Email"
                                label="Username/Email"
                            />
                            <InputField
                                name="password"
                                placeholder="Password"
                                label="Password"
                                type="password"
                            />
                            <Flex mt={4}>
                                <Button
                                    isLoading={isSubmitting}
                                    type="submit"
                                    variantColor="teal"
                                >
                                    Login
                                </Button>
                                <NextLink href="/Forgot-password">
                                    <Link ml="auto">Forgot password?</Link>
                                </NextLink>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </>
    );
};

export default withApollo({ ssr: false })(Login);
