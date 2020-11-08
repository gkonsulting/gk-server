import { Wrapper } from "../components/Wrapper";
import { Navbar } from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
    return (
        <>
            <Navbar />
            <Wrapper>
                <div>index</div>
            </Wrapper>
        </>
    );
};

export default withUrqlClient(createUrqlClient)(Index);
