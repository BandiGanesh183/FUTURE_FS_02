import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ======================
  // LOGIN FUNCTION (FIXED)
  // ======================
  const login = async (formData) => {
    try {
      const res = await axios.post("http://localhost:5000/login", formData);

      if (res.data.success) {
        setUser(res.data.user);

        // store in localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));

        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);
      return false;
    }
  };

  // ======================
  // LOGOUT
  // ======================
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};