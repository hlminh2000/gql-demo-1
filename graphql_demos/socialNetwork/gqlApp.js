const { uniq, maxBy } = require("lodash");
const { gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const fs = require("fs");

const getAllUsers = () =>
  JSON.parse(fs.readFileSync("graphql_demos/socialNetwork/data.json", "utf8"))
    .users;

const getUserById = queryId =>
  getAllUsers().filter(({ id }) => id === Number(queryId));

const writeUsersToDisk = users =>
  fs.writeFileSync(
    "graphql_demos/socialNetwork/data.json",
    JSON.stringify({ users }, null, 2)
  );

const resolveUser = (_, { id: queryId }) => {
  return getUserById(queryId).map(({ id, name, age, friends }) => ({
    id: () => Number(id),
    name: () => name,
    age: () => Number(age),
    friends: ({ id: queryFriendId }) =>
      queryFriendId
        ? friends
            .filter(friendId => friendId === queryFriendId)
            .map(friendId => resolveUser(_, { id: friendId }))
        : friends.map(friendId => resolveUser(_, { id: friendId }))
  }))[0];
};

const resolveUsers = _ => {
  return getAllUsers().map(({ id }) => resolveUser(_, { id }));
};

const newUser = (_, { userData: { name, age } }) => {
  const allUser = getAllUsers();
  const currentMaxIndex = maxBy(allUser.length ? allUser : [{ id: 0 }], "id")
    .id;
  const id = currentMaxIndex + 1;
  const newUser = {
    id,
    name,
    age,
    friends: []
  };
  writeUsersToDisk(allUser.concat(newUser));
  return resolveUser(_, {
    id: newUser.id
  });
};

const newFriendship = (_, { uid1, uid2 }) => {
  const tempUser1 = getUserById(uid1)[0];
  const tempUser2 = getUserById(uid2)[0];
  if (tempUser1 && tempUser2) {
    tempUser1.friends = uniq([...tempUser1.friends, Number(uid2)]);
    tempUser2.friends = uniq([...tempUser2.friends, Number(uid1)]);
    writeUsersToDisk(
      [tempUser1, tempUser2].reduce((users, user, i) => {
        const currentUser = users.find(({ id }) => id === user.id);
        const currentUserIndex = users.indexOf(currentUser);
        const chunk1 = users.slice(0, currentUserIndex);
        const chunk2 = users.slice(currentUserIndex + 1, users.length);
        return [...chunk1, user, ...chunk2];
      }, getAllUsers())
    );
    return {
      user1: _ => resolveUser(_, { id: uid1 }),
      user2: _ => resolveUser(_, { id: uid2 })
    };
  } else {
    if (!tempUser1) {
      throw new Error(`No user was found with id ${uid1}`);
    } else {
      throw new Error(`No user was found with id ${uid2}`);
    }
  }
};

module.exports = makeExecutableSchema({
  typeDefs: gql`
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
  `,
  resolvers: {
    Query: {
      user: resolveUser,
      users: resolveUsers
    },
    Mutation: {
      newUser: newUser,
      newFriendship: newFriendship
    }
  }
});
