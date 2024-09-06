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

const saveCourse = async (
  { title, user_email, description, original_folder_name, author },
  connection
) => {
  const [user] = await connection.query("SELECT * FROM users WHERE email = ?", [
    user_email,
  ]);
  console.log("my user", user, user_email);

  const user_id = _.get(user, "0.id", null);

  console.log("my user id", user_id);
  if (!user_id) {
    console.log("andar");
    throw new Error("User not found");
  }

  // get the last display_sequence for the user
  const [lastDisplaySequence] = await connection.query(
    "SELECT MAX(display_sequence) AS display_sequence FROM courses WHERE user_id = ?",
    [user_id]
  );

  const display_sequence = _.get(lastDisplaySequence, "0.display_sequence", 0);

  console.log("my last display sequence", lastDisplaySequence);

  const [course] = await connection.query(
    "INSERT INTO courses (title, user_id, description, author, original_folder_name, display_sequence) VALUES (?, ?, ?, ?, ?, ?)",
    [
      title,
      user_id,
      description,
      author,
      original_folder_name,
      display_sequence + 1,
    ]
  );

  return course;
};

const saveSection = async ({ title, course_id }, connection) => {
  // find the last display_sequence for the course
  const [lastDisplaySequence] = await connection.query(
    "SELECT MAX(display_sequence) AS display_sequence FROM sections WHERE course_id = ?",
    [course_id]
  );

  const display_sequence = _.get(lastDisplaySequence, "0.display_sequence", 0);

  // insert the section
  const [section] = await connection.query(
    "INSERT INTO sections (title, course_id, display_sequence) VALUES (?, ?, ?)",
    [title, course_id, display_sequence + 1]
  );

  return section;
};

const saveFile = async (
  { title, original_file_name, duration, section_id },
  connection
) => {
  // get display sequence for the section id
  const [lastDisplaySequence] = await connection.query(
    "SELECT MAX(display_sequence) AS display_sequence FROM resources WHERE section_id = ?",
    [section_id]
  );

  const display_sequence = _.get(lastDisplaySequence, "0.display_sequence", 0);

  const [file] = await connection.query(
    "INSERT INTO resources (title, original_file_name, duration, section_id, display_sequence) VALUES (?, ?, ?, ?, ?)",
    [title, original_file_name, duration, section_id, display_sequence + 1]
  );

  return file;
};

module.exports = {
  saveUser,
  saveCourse,
  saveSection,
  saveFile,
  saveNewUser,
};
