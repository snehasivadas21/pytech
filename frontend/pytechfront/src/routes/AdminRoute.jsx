import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  return isAuthenticated && user?.role === "admin"
    ? children
    : <Navigate to="/login" replace />;
};

export default AdminRoute;
