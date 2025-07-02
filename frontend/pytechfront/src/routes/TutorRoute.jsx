import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const TutorRoute = ({ children }) => {
  const {auth} = useContext(AuthContext)

  return auth.access && (auth.role === "instructor" || auth.role === "admin")
    ? children
    : <Navigate to="/login" replace />;
};

export default TutorRoute;
