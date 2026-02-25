const db = require("./db");

exports.createAssignment = async (data) => {
  const { title, description, dueDate, fileName, status } = data;

  await db.execute(
    `INSERT INTO lms.assignments (title, description, due_date, file_name, status)
     VALUES (?, ?, ?, ?, ?)`,
    [title, description, dueDate, fileName, status]
  );
};

exports.getAssignments = async () => {
  const [rows] = await db.execute(`SELECT * FROM lms.assignments`);
  return rows;
};
