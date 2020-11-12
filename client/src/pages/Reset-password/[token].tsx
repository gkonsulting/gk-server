import React, { useState } from "react";
import { NextPage } from "next";
import { Box, Button, Link } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { InputField } from "../../components/InputField";
import { Navbar } from "../../components/Navbar";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import { MeDocument, MeQuery, useChangePasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withApollo } from "../../utils/withApollo";

export const ResetPassword: NextPage = () => {
    const router = useRouter();
    const [changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");
    return (
        <>
            <Navbar />
            <Wrapper variant="small">
                <Formik
                    initialValues={{ newPassword: "" }}
                    onSubmit={async (values, { setErrors }) => {
                        const res = await changePassword({
                            variables: {
                                newPassword: values.newPassword,
                                token:
                                    typeof router.query.token === "string"
                                        ? router.query.token
                                        : "",
                            },
                            update: (cache, { data }) => {
                                cache.writeQuery<MeQuery>({
                                    query: MeDocument,
                                    data: {
                                        __typename: "Query",
                                        me: data?.changePassword.user,
                                    },
                                });
                            },
                        });
                        if (res.data?.changePassword.errors) {
                            const errorMap = toErrorMap(
                                res.data.changePassword.errors
                            );
                            if ("token" in errorMap)
                                setTokenError(errorMap.token);
                            setErrors(errorMap);
                        } else if (res.data?.changePassword.user)
                            router.push("/");
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField
                                name="newPassword"
                                placeholder="New Password"
                                label="New Password"
                                type="password"
                            />
                            {tokenError ? (
                                <Box>
                                    <Box style={{ color: "red" }}>
                                        {tokenError}
                                    </Box>
                                    <NextLink href="/Forgot-password">
                                        <Link>Try resetting again</Link>
                                    </NextLink>
                                </Box>
                            ) : null}
                            <Button
                                mt={4}
                                isLoading={isSubmitting}
                                type="submit"
                                variantColor="teal"
                            >
                                Reset password
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </>
    );
};

export default withApollo({ ssr: false })(ResetPassword);
