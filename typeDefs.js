const { gql } = require("apollo-server-express");

module.exports = gql`
  interface Entity {
    id: ID!
  }

  type User implements Entity {
    id: ID!
    name: String!
    age: Int!
    friends: [User]
  }

  type FriendShip {
    user1: User
    user2: User
  }

  input UserInput {
    name: String!
    age: Int!
  }

  type Query {
    user(id: ID!): User
    users: [User]
  }

  type Mutation {
    newUser(userData: UserInput): User
    newFriendship(uid1: ID!, uid2: ID!): FriendShip
  }
`;