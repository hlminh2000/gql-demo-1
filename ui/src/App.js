import React from "react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import UserEntry from "./components/UserEntry";

const GQL_API_URL = process.env.GQL_API_URL || "http://localhost:4000/graphql";

const App = withStyles({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
})(({ classes }) => {
  const client = new ApolloClient({ uri: GQL_API_URL });
  return (
    <ApolloProvider client={client}>
      <div className={classes.root}>
        <div style={{ maxWidth: 400 }}>
          <UserEntry userId={1} />
        </div>
      </div>
    </ApolloProvider>
  );
});

export default App;
