import { Box } from "@chakra-ui/core";
import React from "react";

interface WrapperProps {
    variant?: "small" | "regular";
}

export const Wrapper: React.FC<WrapperProps> = ({
    children,
    variant = "regular",
}) => {
    return (
        <Box
            mx="auto"
            maxW={variant === "regular" ? "100%" : "600px"}
            w="100%"
            mt={5}
        >
            {children}
        </Box>
    );
};
