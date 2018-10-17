const PORT = process.env.PORT || 3000;
const express = require("express");
const bodyParser = require("body-parser");
const { ApolloServer } = require('apollo-server-express');
const cors = require("cors");
const { makeExecutableSchema } = require("graphql-tools");

const resolvers = require(`./resolvers`);
const typeDefs = require('./typeDefs');
const schema = makeExecutableSchema({ resolvers, typeDefs})

const app = express();
app.use(cors(), bodyParser.json(), bodyParser.urlencoded({ extended: false }));

const server = new ApolloServer({ schema })
server.applyMiddleware({ app, path: `/graphql` })

app.listen(PORT, () => {
  console.log("===============================================");
  console.log(`| graphql:  http://localhost:${PORT}/graphql`);
  console.log("===============================================");
});
