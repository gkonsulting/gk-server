import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";
import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";

function MyApp({ Component, pageProps }: any) {
    const client = new ApolloClient({
        uri: process.env.NEXT_PUBLIC_API_URL,
        cache: new InMemoryCache(),
        credentials: "include",
    });
    return (
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <ColorModeProvider>
                    <CSSReset />
                    <Component {...pageProps} />
                </ColorModeProvider>
            </ThemeProvider>
        </ApolloProvider>
    );
}

export default withUrqlClient(createUrqlClient)(MyApp);
