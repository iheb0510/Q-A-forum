const users = [];

const addUser = ({ id, name, room }) => {
  const user = { id, name, room };

  users.push(user);

  return { user };
};

const getUser = (id, username, room) =>
  users.find(
    (user) => user.id === id && user.name == username && user.room == room
  );

const user_Disconnect = (id) => {
  const index = users.findIndex((p_user) => p_user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = {
  addUser,
  getUser,
  user_Disconnect,
};
