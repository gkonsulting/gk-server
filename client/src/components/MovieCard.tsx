import { Box, Badge, Icon, Image, Flex } from "@chakra-ui/core";
import React from "react";

interface MovieCardProps {
    title: string;
    description: string;
    poster: string;
    rating: string;
    reason: string;
}

export const MovieCard: React.FC<MovieCardProps> = ({
    title,
    description,
    poster,
    rating,
    reason,
}) => {
    return (
        <Box
            w="sm"
            h={600}
            borderWidth="1px"
            rounded="lg"
            overflow="hidden"
            m={5}
        >
            <Flex w="100%" direction="column">
                <Image src={poster} />
            </Flex>
            <Box p="6">
                <Box d="flex" alignItems="baseline">
                    <Badge rounded="full" px="3" variantColor="teal">
                        Genre
                    </Badge>
                </Box>

                <Box
                    mt="1"
                    fontWeight="semibold"
                    as="h4"
                    lineHeight="tight"
                    isTruncated
                >
                    {title}
                </Box>

                <Box>{description}</Box>

                <Box d="flex" mt="2" alignItems="center">
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
                </Box>
                <Box>{reason}</Box>
            </Box>
        </Box>
    );
};
