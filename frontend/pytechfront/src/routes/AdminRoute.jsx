import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("accessToken");

  return token && role === "admin" ? children : <Navigate to="/login" replace />;
};

export default AdminRoute;
