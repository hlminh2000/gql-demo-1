const PORT = process.env.PORT || 4000;
const express = require("express");
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require("graphql-tools");
const fs = require('fs');

const resolvers = require(`./resolvers`);
const typeDefs = require('./typeDefs');
const schema = makeExecutableSchema({ resolvers, typeDefs})

const initUserStore = () => {
  const initialUserStore = {
    users: []
  }
  fs.writeFileSync("./data.json", JSON.stringify(initialUserStore, null, 2));
}

const init = () => {  
  if (!fs.existsSync('./data.json')) {
    initUserStore()
  }
  
  const app = express();
  const server = new ApolloServer({ schema })
  server.applyMiddleware({ app, path: `/graphql` })
  
  app.listen(PORT, () => {
    console.log("===============================================");
    console.log(`| graphql:  http://localhost:${PORT}/graphql`);
    console.log("===============================================");
  });
}

init()