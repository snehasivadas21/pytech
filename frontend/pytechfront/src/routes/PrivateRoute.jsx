import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const PrivateRoute = ({ children }) => {
  const {auth} = useContext(AuthContext)
  return auth.access ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
