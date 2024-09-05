const _ = require("lodash");
const db = require("./index");

const saveUser = async ({ first_name, last_name, email, image_url }) => {
  const [user] = await db.query(
    "INSERT INTO users (first_name, last_name, email, image_url) VALUES (?, ?, ?, ?)",
    [first_name, last_name, email, image_url]
  );
  return user;
};

const saveNewUser = async ({ first_name, last_name, email, image_url }) => {
  const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

  if (!_.isEmpty(user)) {
    return user;
  }

  return await saveUser({ first_name, last_name, email, image_url });
};

module.exports = {
  saveUser,
  saveNewUser,
};
