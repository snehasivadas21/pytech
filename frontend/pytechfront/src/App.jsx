import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layouts & Pages
import Layout from "./components/Layout";
import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import VerifyOtp from "./pages/user/VerifyOtp";
import GoogleCallback from "./pages/user/GoogleCallback";
import Dashboard from "./pages/student/Dashboard";
import NotFound from "./pages/user/NotFound";
import CourseListPage from "./pages/user/Courses";
import CourseDetailPage from "./pages/user/CourseDetailPage";
import About from "./pages/user/About"
import MyCourse from "./pages/student/MyCourses"
import StudentProfile from "./pages/student/StudentProfile"
import StudentQuiz from "./pages/student/StudentQuiz"

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
import StudentLayout from "./components/student/StudentLayout";



function App() {
  return (
  <>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path = "/courses" element={<CourseListPage/>}/>
        <Route path = "/courses/:id" element={<CourseDetailPage/>}/>
        <Route path="/about" element={<About/>} />

        {/* Protected Dashboard */}
        <Route path="/student" element={
          <PrivateRoute>
            <StudentLayout/>
          </PrivateRoute>
        }>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="courses" element={<MyCourse/>}/>
          <Route path="profile" element={<StudentProfile/>} />
          <Route path="quizzes" element={<StudentQuiz/>} />
        </Route>
      </Route>

      {/* Auth Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/google/callback" element={<GoogleCallback />} />

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
    <ToastContainer position="top-right" autoClose={3000}/>
  </>  
  );
}

export default App;
