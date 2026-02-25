import React, { useState, useEffect } from "react";
import { useUser } from "../../Components/Context/UserContext";

const StudentSetting = () => {
  const { user, updateUser } = useUser();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // =============================
  // FETCH SETTINGS FROM BACKEND
  // =============================
  useEffect(() => {
    if (!user?.id) return;

    const fetchSettings = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/settings?userId=${user.id}`
        );
        const data = await res.json();

        setFullname(data.fullName || "");
        setEmail(data.email || "");
        setNotificationsEnabled(Boolean(data.notifications_enabled));

        updateUser({
          themeMode: data.themeMode ?? "light",
        });
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };

    fetchSettings();
  }, [user?.id]);

  // =============================
  // SAVE SETTINGS
  // =============================
  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("fullName", fullname);
      formData.append("email", email);
      formData.append("themeMode", user.themeMode);
      formData.append(
        "notifications_enabled",
        notificationsEnabled ? "1" : "0"
      );

      if (profilePic) {
        formData.append("profileImage", profilePic);
      }

      const res = await fetch("http://localhost:5000/api/settings", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      const updatedUser = await res.json();
      updateUser(updatedUser);

      alert("Settings updated successfully ");
    } catch (err) {
      console.error(err);
      alert("Failed to update settings ");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // DARK MODE
  // =============================
  const handleDarkModeToggle = async () => {
    if (!user?.id) return;

    const newTheme = user.themeMode === "dark" ? "light" : "dark";
    updateUser({ themeMode: newTheme });

    try {
      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("themeMode", newTheme);

      await fetch("http://localhost:5000/api/settings", {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Theme update failed", err);
    }
  };

  return (
    <main className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-3xl mx-auto p-6 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          Settings
        </h2>

        <div className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-200">
              Full Name
            </label>
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            />
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col gap-2">
            <label className="font-medium text-gray-700 dark:text-gray-200">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="block text-sm text-gray-700 dark:text-gray-200"
            />
          </div>

          {/* Notifications */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Enable Notifications
            </span>

            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${notificationsEnabled ? "bg-[rgba(37,150,190,1)]" : "bg-gray-300 dark:bg-gray-600"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
              />
            </button>
          </div>


          {/* Dark Mode */}
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700 dark:text-gray-200">
              Dark Mode
            </span>

            <button
              type="button"
              onClick={handleDarkModeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${user?.themeMode === "dark"
                  ? "bg-[rgba(37,150,190,1)]"
                  : "bg-gray-300 dark:bg-gray-600"
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${user?.themeMode === "dark"
                    ? "translate-x-6"
                    : "translate-x-1"
                  }`}
              />
            </button>
          </div>

          {/* Save */}
          <div className="text-right">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-[rgba(37,150,190,1)] hover:bg-[#115269] text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudentSetting;
