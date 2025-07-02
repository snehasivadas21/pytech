import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    access: localStorage.getItem("accessToken"),
    refresh: localStorage.getItem("refreshToken"),
    username: localStorage.getItem("username"),
    role: localStorage.getItem("role"),
  });

  const logout = () => {
    localStorage.clear();
    setAuth({
      access: null,
      refresh: null,
      username: null,
      role: null,
    });
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
