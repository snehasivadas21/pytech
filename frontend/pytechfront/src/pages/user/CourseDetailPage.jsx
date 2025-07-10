import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPublic from "../../api/axiosPublic";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const isLoggedIn = !!localStorage.getItem("accessToken");

  // ✅ Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axiosPublic.get(`/users/approved/${id}/`);
        setCourse(res.data);
      } catch (err) {
        console.error("Error fetching course detail", err);
      }
    };
    fetchCourse();
  }, [id]);

  // ✅ Check if already enrolled (only if logged in)
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const res = await axiosInstance.get("courses/enrollment/");
        const enrolledCourses = res.data.map((en) => en.course);
        setIsEnrolled(enrolledCourses.includes(course.id));
      } catch (err) {
        console.error("Enrollment check failed", err);
      }
    };

    if (course && isLoggedIn) {
      checkEnrollment();
    }
  }, [course, isLoggedIn]);

  // ✅ Handle enrollment
  const handleEnroll = async () => {
    try {
      await axiosInstance.post("courses/enrollment/", {
        course: course.id,
      });
      toast.success("Enrolled successfully!");
      setIsEnrolled(true);
    } catch (error) {
      console.error(error);
      toast.error("Enrollment failed or already enrolled.");
    }
  };

  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Course Content */}
      <div className="md:col-span-2">
        <div className="relative mb-4">
          <img
            src={course.course_image}
            alt={course.title}
            className="rounded-xl w-full h-64 object-cover"
          />
          {course.category_name && (
            <span className="absolute top-4 left-4 bg-white text-sm text-gray-800 px-3 py-1 rounded-full shadow">
              {course.category_name}
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
          <span>⭐ {course.rating || "4.5"} (12,000 students)</span>
          <span>⏱ {course.duration || "15 hours"}</span>
          <span>🌍 English</span>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          <span className="bg-gray-100 text-sm px-3 py-1 rounded-full">Advanced</span>
          <span className="bg-gray-100 text-sm px-3 py-1 rounded-full">Certificate</span>
          <span className="bg-gray-100 text-sm px-3 py-1 rounded-full">Lifetime Access</span>
        </div>

        {/* Curriculum (Fake for now) */}
        <div className="mt-8 bg-white rounded-xl border shadow p-6">
          <h2 className="text-lg font-bold mb-4">Course Curriculum</h2>
          {[
            "1. Introduction to the Course (15 min)",
            "2. Setting Up Your Environment (30 min)",
            "3. Core Concepts Overview (45 min)",
          ].map((item, idx) => (
            <div
              key={idx}
              className="border-b py-3 flex justify-between text-gray-700 font-medium"
            >
              {item}
              <span>▶</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Sidebar */}
      <div className="bg-white border shadow rounded-xl p-6 h-fit">
        <div className="text-3xl font-bold text-gray-900">
          {course.is_free ? "Free" : `₹${course.price}`}
          {course.original_price && (
            <span className="ml-2 text-lg text-gray-400 line-through">
              ₹{course.original_price}
            </span>
          )}
        </div>

        {course.original_price && (
          <p className="text-green-600 text-sm mt-1">
            Save{" "}
            {Math.round(
              ((course.original_price - course.price) / course.original_price) * 100
            )}
            % today!
          </p>
        )}

        {/* Enroll Button */}
        {isLoggedIn ? (
          !isEnrolled ? (
            <button
              onClick={handleEnroll}
              className="mt-6 bg-blue-600 text-white font-medium w-full py-3 rounded hover:bg-blue-700 transition"
            >
              Enroll Now
            </button>
          ) : (
            <button className="mt-6 bg-gray-400 text-white font-medium w-full py-3 rounded cursor-not-allowed">
              Already Enrolled
            </button>
          )
        ) : (
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-6 bg-gray-400 text-white font-medium w-full py-3 rounded hover:bg-gray-500"
          >
            Login to Enroll
          </button>
        )}

        <button className="mt-3 w-full border text-gray-700 py-2 rounded hover:bg-gray-50">
          Add to Wishlist
        </button>

        <div className="mt-6 text-sm text-gray-600 space-y-2">
          <div>📺 {course.duration || "15 hours"} on-demand video</div>
          <div>📄 8 downloadable resources</div>
          <div>📜 Certificate of completion</div>
          <div>🔒 Full lifetime access</div>
          <div>📱 Access on mobile and TV</div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
