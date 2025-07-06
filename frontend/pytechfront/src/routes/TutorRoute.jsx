import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const TutorRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  return isAuthenticated && user?.role === "instructor"
    ? children
    : <Navigate to="/login" replace />;
};

export default TutorRoute;
