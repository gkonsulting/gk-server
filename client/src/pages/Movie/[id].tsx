import React from "react";
import {
    Box,
    Badge,
    Flex,
    Icon,
    IconButton,
    Stack,
    Text,
    Image,
    Link,
} from "@chakra-ui/core";
import { useGetMovieFromUrl } from "../../utils/useGetMovieFromUrl";
import { Navbar } from "../../components/Navbar";
import { Wrapper } from "../../components/Wrapper";
import { userAuth } from "../../utils/userAuth";
import { useDeleteMovieMutation, useMeQuery } from "../../generated/graphql";
import NextLink from "next/link";
import { withApollo } from "../../utils/withApollo";
import { useRouter } from "next/router";

const Movie = ({}) => {
    const { data, error, loading } = useGetMovieFromUrl();
    const [deleteMovie] = useDeleteMovieMutation();
    const { data: meData } = useMeQuery();
    console.log(data?.getMovie?.id);
    const router = useRouter();
    userAuth(router.query.id);

    if (loading) {
        return (
            <Box>
                <div>loading...</div>
            </Box>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!data?.getMovie) {
        return <Box>could not find post</Box>;
    }

    return (
        <>
            <Navbar />
            <Wrapper>
                <Flex direction="row" wrap="wrap" justify="center">
                    <Box
                        w="6xl"
                        h={1000}
                        borderWidth="1px"
                        rounded="lg"
                        overflow="hidden"
                        m={5}
                    >
                        <Flex h={540} w="100%" direction="column">
                            <Image src={data.getMovie.poster} />
                        </Flex>

                        <Box p="6">
                            <Stack spacing={5}>
                                <Box lineHeight="tight">
                                    <Text fontWeight="bold" fontSize="3xl">
                                        {data.getMovie.title}
                                    </Text>
                                </Box>
                                <Box d="flex" alignItems="baseline">
                                    <Badge
                                        rounded="full"
                                        px="3"
                                        variantColor="teal"
                                    >
                                        Genre
                                    </Badge>
                                </Box>
                                <Box
                                    fontWeight="semibold"
                                    as="h4"
                                    lineHeight="tight"
                                    isTruncated
                                >
                                    <Text>
                                        Suggested by:{" "}
                                        {data.getMovie.creator.username.toUpperCase()}
                                    </Text>
                                </Box>

                                <Box h={75}>
                                    {data.getMovie.description.length > 125
                                        ? data.getMovie.description.slice(
                                              0,
                                              125
                                          ) + "..."
                                        : data.getMovie.description}
                                </Box>

                                <Box d="flex" alignItems="center">
                                    {Array(10)
                                        .fill("")
                                        .map((_, i) => (
                                            <Icon
                                                name="star"
                                                key={i}
                                                color={
                                                    i <
                                                    parseInt(
                                                        data!.getMovie!.rating
                                                    )
                                                        ? "teal.500"
                                                        : "gray.300"
                                                }
                                            />
                                        ))}
                                    <Text
                                        ml={2}
                                        color="teal.500"
                                        fontWeight="bold"
                                    >
                                        {" "}
                                        {" " + data.getMovie.rating + "/10"}
                                    </Text>
                                </Box>
                                <Box lineHeight="tight">
                                    <Text fontWeight="bold" fontSize="md">
                                        Why should we watch this movie?
                                    </Text>
                                    <Text fontSize="md">
                                        {data.getMovie.reason.length < 50
                                            ? data.getMovie.creator.username.toUpperCase() +
                                              `: "` +
                                              data.getMovie.reason +
                                              `"`
                                            : data.getMovie.creator.username.toUpperCase() +
                                              `: "` +
                                              data.getMovie.reason.slice(
                                                  0,
                                                  50
                                              ) +
                                              `"`}
                                    </Text>
                                </Box>
                            </Stack>
                        </Box>

                        {meData?.me?.id !== data.getMovie.creator.id ? null : (
                            <Flex pr="6" flexDirection="row-reverse">
                                <IconButton
                                    icon="delete"
                                    size="sm"
                                    variantColor="teal"
                                    aria-label="Delete Movie"
                                    onClick={() =>
                                        deleteMovie({
                                            variables: {
                                                id: data.getMovie?.id,
                                            },
                                            update: (cache) => {
                                                cache.evict({
                                                    id:
                                                        "Movie:" +
                                                        data.getMovie?.id,
                                                });
                                            },
                                        })
                                    }
                                    w={10}
                                />
                                <NextLink
                                    href="/Movie/Update/[id]"
                                    as={`/Movie/Update/${data.getMovie.id}`}
                                >
                                    <Link>
                                        <IconButton
                                            icon="edit"
                                            size="sm"
                                            variantColor="teal"
                                            aria-label="Update Movie"
                                            w={10}
                                            mr={3}
                                        />
                                    </Link>
                                </NextLink>
                            </Flex>
                        )}
                    </Box>
                </Flex>
            </Wrapper>
        </>
    );
};

export default withApollo({ ssr: true })(Movie);
