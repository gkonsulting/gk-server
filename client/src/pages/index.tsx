import { Wrapper } from "../components/Wrapper";
import { Navbar } from "../components/Navbar";
import { withApollo } from "../utils/withApollo";

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

export default withApollo({ ssr: true })(Index);
