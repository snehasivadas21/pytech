import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

import CourseModal from "../../components/admin/CourseModal"; 

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("Add");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await axiosInstance.get("/courses/admin/courses/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const handleAdd = () => {
    setSelectedCourse(null);
    setModalMode("Add");
    setShowModal(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setModalMode("Edit");
    setShowModal(true);
  };

  const handleModalSubmit = async (formData, id = null) => {
    const token = localStorage.getItem("accessToken");
    try {
      if (modalMode === "Add") {
        await axiosInstance.post("/courses/admin/courses/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axiosInstance.put(`/courses/admin/courses/${id}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      console.error("Error saving course:", err);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm("Are you sure to deactivate this course?")) return;
    const token = localStorage.getItem("accessToken");
    try {
      await axiosInstance.patch(
        `/courses/admin/courses/${course.id}/`,
        { is_active: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const handleStatusUpdate = async (course, newStatus) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axiosInstance.patch(
        `/courses/admin/courses/${course.id}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCourses();
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor_username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-600">All Courses</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          + Add Course
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by title/instructor"
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 border px-3 py-2 rounded w-1/3"
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Instructor</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Active</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4">{course.id}</td>
                <td className="px-6 py-4">{course.title}</td>
                <td className="px-6 py-4">{course.instructor_username}</td>
                <td className="px-6 py-4">{course.status}</td>
                <td className="px-6 py-4">{course.is_active ? "Yes" : "No"}</td>
                <td className="px-6 py-4">
                  {course.course_image ? (
                    <img
                      src={`http://localhost:8000${course.course_image}`}
                      alt="Course"
                      className="w-16 h-12 object-cover rounded"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(course, "approved")}
                    className="text-green-600 hover:underline"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(course, "rejected")}
                    className="text-yellow-600 hover:underline"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleDelete(course)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CourseModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        course={selectedCourse}
        mode={modalMode}
      />
    </div>
  );
};

export default AdminCourses;
