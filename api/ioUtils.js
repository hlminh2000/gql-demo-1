const fs = require("fs");

const getAllUsers = () =>
  JSON.parse(fs.readFileSync("./data.json", "utf8")).users;

const getUserById = queryId =>
  getAllUsers().filter(({ id }) => id === Number(queryId));

const writeUsersToDisk = users =>
  fs.writeFileSync("./data.json", JSON.stringify({ users }, null, 2));

module.exports = {
  getAllUsers,
  getUserById,
  writeUsersToDisk,
};
