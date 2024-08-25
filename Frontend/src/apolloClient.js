import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost/scandiweb_backend/public/index.php/graphql",
  cache: new InMemoryCache(),
});

export default client;
