import { Button, Flex } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Navbar } from "../../../components/Navbar";
import { Wrapper } from "../../../components/Wrapper";
import { useUpdateMovieMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetMovieFromUrl } from "../../../utils/useGetMovieFromUrl";

export const updateMovie: React.FC<{}> = ({}) => {
    const [{ data, error, fetching }] = useGetMovieFromUrl();
    const movie = data?.getMovie;
    const [, updateMovie] = useUpdateMovieMutation();
    const router = useRouter();

    return (
        <>
            <Navbar />
            <Wrapper variant="small">
                <Formik
                    initialValues={{
                        title: movie?.title,
                        description: movie?.description,
                        poster: movie?.poster,
                        reason: movie?.reason,
                        rating: movie?.rating,
                    }}
                    onSubmit={async (values) => {
                        await updateMovie({
                            id: movie?.id,
                            input: values,
                        });
                        router.back();
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
                                name="rating"
                                placeholder="IMDB-rating"
                                label="Rating"
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
                                    Update movie
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Wrapper>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(updateMovie);
