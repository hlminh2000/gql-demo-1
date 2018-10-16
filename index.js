const PORT = process.env.PORT || 3000;
const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require('apollo-server-express');
const cors = require("cors");

const app = express();
app.use(cors(), bodyParser.json(), bodyParser.urlencoded({ extended: false }));

[
  "inventorySystem",
  "randomQuotes",
  "randomQuotes_normalizedData",
  "socialNetwork"
].forEach(projectId => {
  const schema = require(`./graphql_demos/${projectId}/gqlApp`);
  const server = new ApolloServer({ schema })
  server.applyMiddleware({ app, path: `/${projectId}/graphql` })
});

app.listen(PORT, () => {
  console.log("===============================================");
  console.log(`| graphql:  http://localhost:${PORT}/graphql`);
  console.log(`| graphiql: http://localhost:${PORT}/graphiql`);
  console.log("===============================================");
});
