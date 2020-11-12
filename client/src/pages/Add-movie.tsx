import { Flex, Button } from "@chakra-ui/core";
import { Formik, Form } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Navbar } from "../components/Navbar";
import { Wrapper } from "../components/Wrapper";
import { useAddMovieMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { userAuth } from "../utils/userAuth";
import { withApollo } from "../utils/withApollo";
const AddMovie: React.FC<{}> = ({}) => {
    userAuth(); // Sjekker om bruker er logget inn, hvis ikke navigeres brukeren til login
    const [addMovie] = useAddMovieMutation();
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
                        rating: "",
                    }}
                    onSubmit={async (values) => {
                        const { errors } = await addMovie({
                            variables: { input: values },
                            update: (cache) => {
                                cache.evict({ fieldName: "getMovies" });
                            },
                        });
                        if (!errors) {
                            router.push("/Movies");
                        }
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
export default withApollo({ ssr: false })(AddMovie);
