import { Wrapper } from "../components/Wrapper";
import { Navbar } from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useGetMoviesQuery } from "../generated/graphql";

const Index = () => {
    const [{ data }] = useGetMoviesQuery();
    return (
        <Wrapper>
            <Navbar />
            <div>hello world</div>
            {!data
                ? null
                : data.getMovies.map((movie) => (
                      <div>
                          {movie.id}. {movie.title}
                      </div>
                  ))}
        </Wrapper>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
