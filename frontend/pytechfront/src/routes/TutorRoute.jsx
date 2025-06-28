import { Navigate } from "react-router-dom";

const TutorRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("accessToken");

  return token && (role === "instructor" || role === "admin")
    ? children
    : <Navigate to="/login" replace />;
};

export default TutorRoute;
