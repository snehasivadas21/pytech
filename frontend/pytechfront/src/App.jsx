import { Routes, Route } from "react-router-dom";

// Layouts & Pages
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import GoogleCallback from "./pages/GoogleCallback";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTutors from "./pages/admin/AdminTutors";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseApproval from "./pages/admin/AdminCourseApproval";
import AdminCategories from "./pages/admin/AdminCategories";

// Tutor
import TutorLayout from "./components/tutor/TutorLayout";
import TutorDashboard from "./pages/tutor/TutorDashboard";
import TutorCourses from "./pages/tutor/TutorCourses";

// Routes
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import TutorRoute from "./routes/TutorRoute";

function App() {
  return (
    <Routes>
      {/* Public Home + Layout */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/google/callback" element={<GoogleCallback />} />

      {/* Protected Dashboard */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      {/* Admin Section */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="instructors" element={<AdminTutors />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="approvals" element={<AdminCourseApproval/>}/>
        <Route path="categories" element={<AdminCategories />} />
      </Route>

      {/* Tutor Section */}
      <Route path="/tutor" element={
        <TutorRoute>
          <TutorLayout />
        </TutorRoute>
      }>
        <Route index element={<TutorDashboard />} />
        <Route path="dashboard" element={<TutorDashboard />} />
        <Route path="courses" element={<TutorCourses />} />
      </Route>

      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
