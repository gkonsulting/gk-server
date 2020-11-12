import { Flex, Button, Box } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Navbar } from "../components/Navbar";
import { Wrapper } from "../components/Wrapper";
import { useResetPasswordMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

export const ForgotPassword: React.FC<{}> = ({}) => {
    const [complete, setComplete] = useState(false);
    const [resetPassword] = useResetPasswordMutation();
    return (
        <>
            <Navbar />
            <Wrapper variant="small">
                <Formik
                    initialValues={{ email: "" }}
                    onSubmit={async (values) => {
                        await resetPassword({ variables: values });
                        setComplete(true);
                    }}
                >
                    {({ isSubmitting }) =>
                        complete ? (
                            <Box>
                                If an account is registered with the submitted
                                email, please check your inbox
                            </Box>
                        ) : (
                            <Form>
                                <InputField
                                    name="email"
                                    placeholder="Email"
                                    label="Email"
                                    type="email"
                                />
                                <Flex mt={4}>
                                    <Button
                                        isLoading={isSubmitting}
                                        type="submit"
                                        variantColor="teal"
                                    >
                                        Forgot password
                                    </Button>
                                </Flex>
                            </Form>
                        )
                    }
                </Formik>
            </Wrapper>
        </>
    );
};
export default withApollo({ ssr: false })(ForgotPassword);
