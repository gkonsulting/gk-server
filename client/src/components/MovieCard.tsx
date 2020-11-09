import { Box, Badge, Icon, Image, Flex, Text, Stack } from "@chakra-ui/core";
import React from "react";

interface MovieCardProps {
    title: string;
    description: string;
    poster: string;
    rating: string;
    reason: string;
    creator: Object;
}

export const MovieCard: React.FC<MovieCardProps> = ({
    title,
    description,
    poster,
    rating,
    reason,
    creator,
}) => {
    return (
        <Box
            w="sm"
            h={650}
            borderWidth="1px"
            rounded="lg"
            overflow="hidden"
            m={5}
        >
            <Flex w="100%" direction="column">
                <Image src={poster} />
            </Flex>

            <Box p="6">
                <Stack spacing={5}>
                    <Box lineHeight="tight">
                        <Text fontWeight="bold" fontSize="3xl">
                            {title}
                        </Text>
                    </Box>
                    <Box d="flex" alignItems="baseline">
                        <Badge rounded="full" px="3" variantColor="teal">
                            Genre
                        </Badge>
                    </Box>
                    <Box
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                    >
                        <Text>Suggested by: {creator.username}</Text>
                    </Box>

                    <Box>{description}</Box>

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
                            {creator.username + `: "` + reason + `"`}
                        </Text>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};
