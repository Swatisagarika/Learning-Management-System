import pool from "../config/db.js";

export const getUserSettings = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
      id,
      role,
      fullName,
      email,
      profileImage,
      themeMode,
      notifications_enabled
     FROM users
     WHERE id = ?`,
    [userId]
  );
  return rows[0];
};

export const updateUserSettings = async (
  userId,
  fullName,
  email,
  profileImage,
  themeMode,
  notifications_enabled
) => {
  await pool.query(
    `UPDATE users SET
      fullName = ?,
      email = ?,
      profileImage = COALESCE(?, profileImage),
      themeMode = ?,
      notifications_enabled = ?
     WHERE id = ?`,
    [fullName, email, profileImage, themeMode, notifications_enabled, userId]
  );

  return getUserSettings(userId);
};
