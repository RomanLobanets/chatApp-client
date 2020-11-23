import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";

import Routes from "./Routes";
import "semantic-ui-css/semantic.min.css";
import client from "./apollo";

const App = () => (
  <ApolloProvider client={client}>
    <Routes />
  </ApolloProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
