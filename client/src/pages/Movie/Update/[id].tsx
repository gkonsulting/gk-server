import { Button, Flex } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Navbar } from "../../../components/Navbar";
import { Wrapper } from "../../../components/Wrapper";
import { useUpdateMovieMutation } from "../../../generated/graphql";
import { useGetMovieFromUrl } from "../../../utils/useGetMovieFromUrl";
import { userAuth } from "../../../utils/userAuth";
import { withApollo } from "../../../utils/withApollo";

export const updateMovie: React.FC<{}> = ({}) => {
    userAuth();
    const { data, error, loading } = useGetMovieFromUrl();
    const movie = data?.getMovie;
    const [updateMovie] = useUpdateMovieMutation();
    const router = useRouter();

    if (loading) {
        return <div>loading....</div>;
    }

    if (!loading && !data?.getMovie) {
        return <div>No movie found</div>;
    } else {
        return (
            <>
                <Navbar />
                <Wrapper variant="small">
                    <Formik
                        initialValues={{
                            title: movie?.title as string,
                            description: movie?.description as string,
                            poster: movie?.poster as string,
                            reason: movie?.reason as string,
                            rating: movie?.rating as string,
                        }}
                        onSubmit={async (values) => {
                            await updateMovie({
                                variables: {
                                    id: movie?.id,
                                    input: values,
                                },
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
    }
};

export default withApollo({ ssr: true })(updateMovie);
