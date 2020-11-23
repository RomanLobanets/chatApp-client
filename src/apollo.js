import {
  HttpLink,
  ApolloClient,
  InMemoryCache,
  split,
  ApolloLink,
  from,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import createFileLink from "./createFileLink";

export const wsLink = new WebSocketLink({
  uri: `ws://localhost:8080/subscriptions`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: {
      token: localStorage.getItem("token"),
      refreshToken: localStorage.getItem("refreshToken"),
    },
  },
});

const httpLink = createFileLink({
  uri: "http://localhost:8080/",
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  operation.setContext({
    headers: {
      xToken: token ? token : "",
      xRefreshToken: refreshToken ? refreshToken : "",
    },
  });
  return forward(operation);
});

const resrLink = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    const {
      response: { headers },
    } = context;

    if (headers) {
      const token = headers.get("xToken");
      const refreshToken = headers.get("xRefreshToken");
      if (token) {
        localStorage.setItem("token", token);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }
    return response;
  });
});

const httpLinkMiddleware = resrLink.concat(authLink.concat(httpLink));
// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinkMiddleware
);

export default new ApolloClient({
  link: link,
  //   from([authLink, resrLink, splitLink]),
  cache: new InMemoryCache(),
});
