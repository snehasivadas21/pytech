import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import GoogleCallback from "./pages/GoogleCallback";
import Login from "./pages/Login";
import Home from './pages/Home';
import Layout from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthContext";

function App() {
  return (
  <AuthProvider> 
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home/>}/>
        </Route>  
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/google/callback" element={<GoogleCallback />} />
          <Route path="/login" element={<Login />} />
        
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  </AuthProvider>  
  );
}

export default App;
