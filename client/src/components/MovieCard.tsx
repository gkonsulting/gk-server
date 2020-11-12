import {
    Box,
    Badge,
    Icon,
    Image,
    Flex,
    Text,
    Stack,
    IconButton,
    Link,
} from "@chakra-ui/core";
import React from "react";
import { useDeleteMovieMutation, useMeQuery } from "../generated/graphql";
import NextLink from "next/link";
interface MovieCardProps {
    id: number;
    title: string;
    description: string;
    poster: string;
    rating: string;
    reason: string;
    creator: Object;
}

export const MovieCard: React.FC<MovieCardProps> = ({
    id,
    title,
    description,
    poster,
    rating,
    reason,
    creator,
}) => {
    const [deleteMovie] = useDeleteMovieMutation();
    const { data } = useMeQuery();

    return (
        <Box
            w="sm"
            h={650}
            borderWidth="1px"
            rounded="lg"
            overflow="hidden"
            m={5}
        >
            <NextLink href="/Movie/[id]" as={`/Movie/${id}`}>
                <Link _hover={{ textDecoration: "none" }}>
                    <Flex h={230} w="100%" direction="column">
                        <Image src={poster} />
                    </Flex>

                    <Box p="6">
                        <Stack spacing={4}>
                            <Box lineHeight="tight">
                                <Text fontWeight="bold" fontSize="3xl">
                                    {title}
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
                                    {creator.username.toUpperCase()}
                                </Text>
                            </Box>

                            <Box h={75}>
                                {description.length > 115
                                    ? description.slice(0, 115) + "..."
                                    : description}
                            </Box>

                            <Box d="flex" alignItems="center">
                                {Array(10)
                                    .fill("")
                                    .map((_, i) => (
                                        <Icon
                                            name="star"
                                            key={i}
                                            color={
                                                i < parseInt(rating)
                                                    ? "teal.500"
                                                    : "gray.300"
                                            }
                                        />
                                    ))}
                                <Text ml={2} color="teal.500" fontWeight="bold">
                                    {" "}
                                    {" " + rating + "/10"}
                                </Text>
                            </Box>
                            <Box lineHeight="tight">
                                <Text fontWeight="bold" fontSize="md">
                                    Why should we watch this movie?
                                </Text>
                                <Text fontSize="md">
                                    {reason.length < 50
                                        ? creator.username.toUpperCase() +
                                          `: "` +
                                          reason +
                                          `"`
                                        : creator.username.toUpperCase() +
                                          `: "` +
                                          reason.slice(0, 50) +
                                          `"`}
                                </Text>
                            </Box>
                        </Stack>
                    </Box>
                </Link>
            </NextLink>
            {data?.me?.id !== creator.id ? null : (
                <Flex pr="6" flexDirection="row-reverse">
                    <IconButton
                        icon="delete"
                        size="sm"
                        variantColor="teal"
                        aria-label="Delete Movie"
                        onClick={() =>
                            deleteMovie({
                                variables: {
                                    id: id,
                                },
                                update: (cache) => {
                                    cache.evict({
                                        id: "Movie:" + id,
                                    });
                                },
                            })
                        }
                        w={10}
                    />
                    <NextLink
                        href="/Movie/Update/[id]"
                        as={`/Movie/Update/${id}`}
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
    );
};
