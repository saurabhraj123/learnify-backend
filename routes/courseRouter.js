const _ = require("lodash");
const router = require("express").Router();
const { checkJwt } = require("../utils/authUtils");
const pool = require("../db");
const { saveCourse, saveSection, saveFile } = require("../db/mutations");

router.post("/", checkJwt, async (req, res) => {
  const payload = req.body;
  console.log({ payload });

  const courseTitle = _.get(payload, "courseTitle", "");
  const courseDescription = _.get(payload, "description", "");
  const author = _.get(payload, "author", "");
  const user_email = _.get(payload, "email", "");

  const connection = await pool.getConnection();

  try {
    // start transaction
    await connection.beginTransaction();

    console.log("saving course");
    // 1. Save course
    const course = await saveCourse(
      {
        title: courseTitle,
        description: courseDescription,
        author,
        user_email,
        original_folder_name: courseTitle,
      },
      connection
    );

    console.log("course saved", course);

    // 2. Save sections and associated files
    const sections = _.get(payload, "sections", []);
    for (const section of sections) {
      const { title, files } = section;
      const dbSection = await saveSection(
        { title, course_id: course.insertId },
        connection
      );

      for (const file of files) {
        const { title, sourceTitle, duration } = file;
        await saveFile(
          {
            title,
            original_file_name: sourceTitle,
            duration,
            section_id: dbSection.insertId,
          },
          connection
        );
      }
    }

    // commit transaction
    await connection.commit();

    res.status(200).send({ id: course.insertId });
  } catch (error) {
    console.error({ error });
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
