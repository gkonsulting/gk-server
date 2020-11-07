import { Flex, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Navbar } from "../components/Navbar";
import { Wrapper } from "../components/Wrapper";
import { useAddMovieMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
const AddMovie: React.FC<{}> = ({}) => {
    const [, addMovie] = useAddMovieMutation();
    const router = useRouter();
    return (
        <>
            <Navbar />
            <Wrapper variant="small">
                <Formik
                    initialValues={{
                        title: "",
                        description: "",
                        poster: "",
                        reason: "",
                        score: 0,
                    }}
                    onSubmit={async (values) => {
                        console.log(typeof values.score);
                        
                        await addMovie({ input: values });
                        router.push("/");
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <InputField
                                name="title"
                                placeholder="Title"
                                label="Title"
                            />
                            <InputField
                                name="description"
                                placeholder="Description"
                                label="Description"
                            />
                            <InputField
                                name="score"
                                placeholder="IMDB-Score"
                                label="Score"
                                type="decimal"
                            />
                            <InputField
                                name="poster"
                                placeholder="IMDB-poster link"
                                label="IMDB-poster link"
                            />
                            <InputField
                                name="reason"
                                placeholder="Why do you want to watch this movie?"
                                label="Reason why?"
                            />
                            <Flex mt={4}>
                                <Button
                                    isLoading={isSubmitting}
                                    type="submit"
                                    variantColor="teal"
                                >
                                    Add movie
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </>
    );
};
export default withUrqlClient(createUrqlClient)(AddMovie);
