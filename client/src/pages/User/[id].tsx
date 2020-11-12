import React from "react";
import { Box, Flex, Text } from "@chakra-ui/core";
import { Navbar } from "../../components/Navbar";
import { Wrapper } from "../../components/Wrapper";
import { userAuth } from "../../utils/userAuth";
import { useMeQuery } from "../../generated/graphql";
import { withApollo } from "../../utils/withApollo";

const Movie = ({}) => {
    userAuth();
    const { data: meData } = useMeQuery();

    return (
        <>
            <Navbar />
            <Wrapper variant="small">
                <Text textAlign="center" fontSize="6xl">
                    Profile
                </Text>
                <Flex direction="row" wrap="wrap" justify="center">
                    <Box
                        w="lg"
                        h={400}
                        borderWidth="2px"
                        rounded="lg"
                        overflow="hidden"
                        m={5}
                    >
                        <Text>Username: {meData?.me?.username}</Text>
                        <Text>Email: {meData?.me?.email}</Text>
                        <Text>Reset password?</Text>
                    </Box>
                </Flex>
            </Wrapper>
        </>
    );
};

export default withApollo({ ssr: false })(Movie);
