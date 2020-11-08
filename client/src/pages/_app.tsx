import { ThemeProvider, CSSReset, ColorModeProvider } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";

function MyApp({ Component, pageProps }: any) {
    return (
        <ThemeProvider theme={theme}>
            <ColorModeProvider>
                <CSSReset />
                <Component {...pageProps} />
            </ColorModeProvider>
        </ThemeProvider>
    );
}

export default withUrqlClient(createUrqlClient)(MyApp);
