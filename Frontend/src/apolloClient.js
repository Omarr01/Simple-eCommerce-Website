import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://scandiweb-test-backend.infinityfreeapp.com/public/index.php/graphql",
  cache: new InMemoryCache(),
});

export default client;
