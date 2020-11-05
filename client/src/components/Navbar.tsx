import React, { Fragment } from "react";
import { Box, Heading, Flex, Text, Button, Link } from "@chakra-ui/core";
import { DarkModeSwitch } from "./DarkModeSwitch";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = (props) => {
    const [{ data, fetching }] = useMeQuery();
    let body = null;
    if (fetching) {
    } else if (!data?.me) {
        body = (
            <>
                <Box mt={{ base: 4, md: 0 }} mr={5}>
                    <NextLink href="/Login">
                        <Link>
                            <Button bg="transparent" border="1px">
                                Login
                            </Button>
                        </Link>
                    </NextLink>
                </Box>
                <Box mt={{ base: 4, md: 0 }} mr={5}>
                    <NextLink href="/Register">
                        <Link>
                            <Button bg="transparent" border="1px">
                                Register
                            </Button>
                        </Link>
                    </NextLink>
                </Box>
            </>
        );
    } else {
        body = (
            <>
                <Box mt={{ base: 4, md: 0 }} mr={5}>
                    <NextLink href="/Login">
                        <Link>
                            <Button bg="transparent" border="1px">
                                User: {data.me.username}
                            </Button>
                        </Link>
                    </NextLink>
                </Box>
                <Box mt={{ base: 4, md: 0 }} mr={5}>
                    <NextLink href="/Login">
                        <Link>
                            <Button bg="transparent" border="1px">
                                Logout
                            </Button>
                        </Link>
                    </NextLink>
                </Box>
            </>
        );
    }
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="1.5rem"
            bg="teal.500"
            color="white"
            {...props}
        >
            <Flex align="center" mr={5}>
                <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
                    App
                </Heading>
            </Flex>
            <Flex justifyContent={"row-reverse"} alignItems={"center"}>
                {body}
                <Box mt={{ base: 4, md: 0 }} mr={5}>
                    <DarkModeSwitch />
                </Box>
            </Flex>
        </Flex>
    );
};
