import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (username && role) {
      setUser({ username, role });
    } else {
      setUser(null);
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PyTech
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search courses"
            className="px-6 py-2 rounded-full border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 shadow-sm"
          />
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-bold">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 font-bold">About</Link>
          <Link to="/courses" className="text-gray-600 hover:text-blue-600 font-bold">Courses</Link>
          <Link to="/services" className="text-gray-600 hover:text-blue-600 font-bold">Services</Link>
          <Link to="/certification" className="text-gray-600 hover:text-blue-600 font-bold">Certification</Link>
        </div>

        {/* Auth/Profile Section */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          {user ? (
            <div
              className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-extrabold"
              onClick={() => setOpenDropdown(!openDropdown)}
              title={user.username}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </div>
          )}

          {/* Dropdown */}
          {openDropdown && user && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
              <div className="px-4 py-2 text-gray-700 font-medium">
                {user.username}-{user.role}
              </div>
              <hr />
              <button
                onClick={() => navigate("/dashboard")}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
