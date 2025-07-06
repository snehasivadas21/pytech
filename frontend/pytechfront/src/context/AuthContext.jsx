import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const getStoredToken = () => {
    const token = localStorage.getItem("accessToken");
    return token && token.split(".").length === 3 ? token : null;
  };

  const [authTokens, setAuthTokens] = useState(() => {
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    return access && refresh ? { access, refresh } : null;
  });

  const [user, setUser] = useState(() => {
    const token = getStoredToken();
    return token ? jwtDecode(token) : null;
  });

  const loginUser = (access, refresh) => {
    if (access && refresh) {
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      setAuthTokens({ access, refresh });
      setUser(jwtDecode(access));
      navigate("/dashboard"); // or redirect based on role
    } else {
      console.error("Login failed: missing tokens.");
    }
  };

  const logoutUser = () => {
    localStorage.clear();
    setAuthTokens(null);
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const token = authTokens?.access;
    if (token && token.split(".").length === 3) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logoutUser();
        }else {
          setUser(decoded);
          setAuthTokens({
            access: token,
            refresh: localStorage.getItem("refreshToken"),
          });
        }
      } catch {
        logoutUser();
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        user,
        loginUser,
        logoutUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
