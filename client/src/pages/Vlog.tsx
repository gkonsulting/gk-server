import React from "react";
import { Box, Flex, Text } from "@chakra-ui/core";
import { Navbar } from "../components/Navbar";
import { Wrapper } from "../components/Wrapper";
import { userAuth } from "../utils/userAuth";
import { withApollo } from "../utils/withApollo";
import ReactPlayer from "react-player";

const Vlog = ({}) => {
    userAuth();
    return (
        <>
            <Navbar />
            <Wrapper variant="small">
                <Flex direction="row" wrap="wrap" justify="center">
                    <Text textAlign="center" fontSize="6xl">
                        Vlog
                    </Text>
                    <ReactPlayer url="https://www.dailymotion.com/video/x7na563"></ReactPlayer>
                    <ReactPlayer url="https://www.dailymotion.com/video/x7na7ux"></ReactPlayer>
                </Flex>
            </Wrapper>
        </>
    );
};

export default withApollo({ ssr: true })(Vlog);
