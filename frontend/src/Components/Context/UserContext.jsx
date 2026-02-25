import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

/* =========================
   APPLY THEME GLOBALLY
========================= */
const applyTheme = (theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD USER ON APP START
     (TOKEN BASED AUTH)
  ========================== */
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // ✅ Only login if token exists
      if (token && storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        applyTheme(parsed.themeMode || "light");
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("User load error:", err);
      setUser(null);
    }

    setLoading(false);
  }, []);

  /* =========================
     APPLY THEME WHEN CHANGED
  ========================== */
  useEffect(() => {
    if (user?.themeMode) {
      applyTheme(user.themeMode);
    }
  }, [user?.themeMode]);

  /* =========================
     SAFE UPDATE USER
     (MERGE — NEVER REPLACE)
  ========================== */
  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const mergedUser = {
        ...prev,
        ...updatedUser,
        id: updatedUser.id ?? prev?.id,
        role: updatedUser.role ?? prev?.role,
      };

      localStorage.setItem("user", JSON.stringify(mergedUser));

      return mergedUser;
    });
  };

  /* =========================
     LOGOUT (CLEAR EVERYTHING)
  ========================== */
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUser(null);
  };

  /* =========================
     FETCH USER PROFILE
  ========================== */
  const fetchUserProfile = async (userId) => {
    if (!userId) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/settings?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ secure
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch user profile");

      const data = await res.json();

      updateUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        profileImage: data.profileImage,
        themeMode: data.themeMode ?? "light",
        notifications_enabled: data.notifications_enabled ?? 0,
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        updateUser,
        logout,
        fetchUserProfile,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
