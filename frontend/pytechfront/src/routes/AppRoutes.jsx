import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard"
import PrivateRoute from "./PrivateRoute";

import AdminRoute from "./AdminRoute";
import AdminLayout from "../components/admin/AdminLayout"; 
import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminStudents from "../pages/admin/AdminStudents";
import AdminTutors from "../pages/admin/AdminTutors";
import AdminCourses from "../pages/admin/AdminCourses"
import AdminCategories from "../pages/admin/AdminCategories";

import TutorRoute from "./TutorRoute";
import TutorLayout from "../components/tutor/TutorLayout"
import TutorDashboard from "../pages/tutor/TutorDashboard"
import TutorCourses from "../pages/tutor/TutorCourses"


const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/dashboard" element={
        <PrivateRoute> 
          <Dashboard /> 
        </PrivateRoute>
        }/>

        <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout /> 
        </AdminRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="instructors" element={<AdminTutors />} />
          <Route path="courses" element={<AdminCourses/>}/>
          <Route path="categories" element={<AdminCategories/>}/>
          {/* <Route path="stats" element={<AdminStats />} /> */}
        </Route>

        <Route path="/tutor" element={
          <TutorRoute>
            <TutorLayout/>
          </TutorRoute>
        }>
          <Route path="dashboard" element={<TutorDashboard/>}/>
          <Route path="courses" element={<TutorCourses/>}/>

        </Route>
    </Routes>
  )
}

export default AppRoutes



      