import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("/auth/signin", inputs);
    setCurrentUser(res.data?.data?.user);
  };

  const logout = async (inputs) => {
    await axios.post("/auth/signout");
    setCurrentUser(null);
    window.location = '/'
  };

  const register = (user) => {
    setCurrentUser(user)
  }

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
