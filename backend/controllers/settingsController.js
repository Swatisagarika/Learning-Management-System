import {
  getUserSettings,
  updateUserSettings,
} from "../models/settingsModel.js";

export const fetchSettings = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const user = await getUserSettings(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("fetchSettings error:", err);
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      email,
      themeMode,
      notifications_enabled,
    } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    let profileImage = null;
    if (req.file) {
      profileImage = `/uploads/${req.file.filename}`;
    }

    const notifications =
      notifications_enabled === true ||
      notifications_enabled === "true" ||
      notifications_enabled === "1"
        ? 1
        : 0;

    const updatedUser = await updateUserSettings(
      userId,
      fullName,
      email,
      profileImage,
      themeMode,
      notifications
    );

    res.json(updatedUser);
  } catch (err) {
    console.error("updateSettings error:", err);
    res.status(500).json({ message: "Failed to update settings" });
  }
};
