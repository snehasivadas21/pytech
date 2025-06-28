import { Outlet, useLocation } from "react-router-dom";
import TutorNavbar from "./TutorNavbar";
import TutorSidebar from "./TutorSidebar";


const getTitleFromPath = (path) => {
  if (path.includes("courses")) return "Course Management";
  return "Tutor Overview";
};

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      <TutorSidebar/>
      <main className="flex-1 flex flex-col">
        <TutorNavbar title={getTitleFromPath(location.pathname)} />
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
