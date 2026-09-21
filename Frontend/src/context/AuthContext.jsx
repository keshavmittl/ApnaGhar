import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";

// A corrupted `user` entry used to throw during render and white-screen the app,
// so parsing is defensive and self-healing.
const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") return null;
    return JSON.parse(raw) || null;
  } catch {
    try {
      localStorage.removeItem("user");
    } catch {
      // Storage is unavailable entirely; treat the session as anonymous.
    }
    return null;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(readStoredUser);

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      // Storing the string "null" made the key look populated on the next boot.
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};