const pool = require("../config/db");

const getAllLessons = async () => {
  const [rows] = await pool.query(`
    SELECT 
      id,
      title,
      type,
      file AS fileUrl,
      externalLink,
      mandatory,
      allowDownload,
      status
    FROM lms.lessons
    ORDER BY id DESC
  `);
  return rows;
};

const createLesson = async (data) => {
  const {
    title,
    type,
    file,
    externalLink,
    mandatory,
    allowDownload,
    status,
  } = data;

  const sql = `
    INSERT INTO lms.lessons
    (title, type, file, externalLink, mandatory, allowDownload, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    title,
    type,
    file,
    externalLink,
    mandatory,
    allowDownload,
    status,
  ]);

  return { id: result.insertId, ...data };
};

const updateLesson = async (id, data) => {
  const sql = `
    UPDATE lms.lessons
    SET
      title = ?,
      type = ?,
      externalLink = ?,
      mandatory = ?,
      allowDownload = ?,
      status = ?,
      file = COALESCE(?, file)
    WHERE id = ?
  `;

  await pool.query(sql, [
    data.title,
    data.type,
    data.externalLink,
    data.mandatory,
    data.allowDownload,
    data.status,
    data.file,
    id,
  ]);
};

const deleteLesson = async (id) => {
  await pool.query("DELETE FROM lms.lessons WHERE id = ?", [id]);
};

module.exports = {
  getAllLessons,
  createLesson,
  updateLesson,
  deleteLesson,
};
