import React from "react";
import App from "./App";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "apollo-link-context";

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  let authHeaders = {};
  if (token !== null) {
    authHeaders = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return authHeaders;
});

const httpLink = createHttpLink({
  uri: "https://shielded-caverns-86843.herokuapp.com/",
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
