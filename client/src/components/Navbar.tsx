import React from "react";
import { Box, Heading, Flex, Text, Button, Link } from "@chakra-ui/core";
import { DarkModeSwitch } from "./DarkModeSwitch";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = (props) => {
    const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery({
        pause: isServer(), // fetcher ikke CS, bare SSR
    });
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
                    <NextLink href="/Movies">
                        <Link>
                            <Button bg="transparent" border="1px">
                                Movies
                            </Button>
                        </Link>
                    </NextLink>
                </Box>
                <Box mt={{ base: 4, md: 0 }} mr={5}>
                    <NextLink href="/Add-movie">
                        <Link>
                            <Button bg="transparent" border="1px">
                                Add movie
                            </Button>
                        </Link>
                    </NextLink>
                </Box>
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
                    <Button
                        onClick={() => {
                            logout();
                        }}
                        isLoading={logoutFetching}
                        bg="transparent"
                        border="1px"
                    >
                        Logout
                    </Button>
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
            bg="black"
            color="white"
            position="fixed"
            w="100%"
            zIndex={1}
            {...props}
        >
            <Flex align="center" mr={5}>
                <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
                    <NextLink href="/">GK</NextLink>
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
