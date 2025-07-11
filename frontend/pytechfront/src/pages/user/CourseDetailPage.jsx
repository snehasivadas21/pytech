import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosPublic from "../../api/axiosPublic";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const CourseDetailPage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [modules, setModules] = useState([]);

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

  // ✅ Check if already enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const res = await axiosInstance.get("/payments/purchase/");
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

  // ✅ Enroll (for free courses only)
  const handleEnroll = async () => {
    try {
      await axiosInstance.post("payments/purchase/", {
        course: course.id,
      });
      toast.success("Enrolled successfully!");
      setIsEnrolled(true);
    } catch (error) {
      console.error(error);
      toast.error("Enrollment failed or already enrolled.");
    }
  };

  // ✅ Buy and Enroll (Paid courses only)
  const handleBuyNow = async () => {
    try {
      const res = await axiosInstance.post("payments/create-order/", {
        course_id: course.id,
      });

      const { razorpay_order_id, amount, currency, key } = res.data;

      const options = {
        key,
        amount,
        currency,
        name: "PyTech Academy",
        description: course.title,
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            await axiosInstance.post("payments/verify-payment/", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Course unlocked.");
            setIsEnrolled(true);
          } catch (err) {
            console.error("Verification failed", err);
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Buy now failed", err);
      toast.error("Payment failed or canceled.");
    }
  };

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axiosPublic.get(`/courses/modules/?course=${id}`);
        const modulesWithLessons = await Promise.all(
          res.data.map(async (mod) => {
            const lres = await axiosPublic.get(`/courses/lessons/?module=${mod.id}`);
            return { ...mod, lessons: lres.data };
          })
        );
        setModules(modulesWithLessons);
      } catch (err) {
        console.error("Error fetching curriculum", err);
      }
    };
    fetchCurriculum();
  }, [id]);


  if (!course) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left: Course Info */}
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

        {/* Curriculum */}
        <div className="mt-8 bg-white rounded-xl border shadow p-6">
          <h2 className="text-lg font-bold mb-4">Course Curriculum</h2>
          {modules.length === 0 ? (
            <p className="text-gray-500">No modules available yet.</p>
          ) : (
            modules.map((mod, idx) => (
              <div key={mod.id} className="mb-4">
                <h3 className="font-semibold text-purple-700 mb-2">
                  {idx + 1}. {mod.title}
                </h3>
                <ul className="space-y-2 pl-4 border-l-2 border-purple-200">
                  {mod.lessons.map((lesson, i) => (
                    <li key={lesson.id} className="flex justify-between items-center text-gray-700">
                      <span>{i + 1}. {lesson.title}</span>
                      <span className="text-sm text-gray-400">{lesson.content_type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
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
            Save {Math.round(((course.original_price - course.price) / course.original_price) * 100)}% today!
          </p>
        )}

        {/* 🔥 Conditional Button */}
        {isLoggedIn ? (
          !isEnrolled ? (
            course.is_free ? (
              <button
                onClick={handleEnroll}
                className="mt-6 bg-blue-600 text-white font-medium w-full py-3 rounded hover:bg-blue-700 transition"
              >
                Enroll Now
              </button>
            ) : (
              <button
                onClick={handleBuyNow}
                className="mt-6 bg-green-600 text-white font-medium w-full py-3 rounded hover:bg-green-700 transition"
              >
                Buy Now ₹{course.price}
              </button>
            )
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
