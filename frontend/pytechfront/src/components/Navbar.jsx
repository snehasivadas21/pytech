import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

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

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(false);
  }, [location]);

  const handleDashboard = () => {
    if (auth.role === "admin") navigate("/admin/dashboard");
    else if (auth.role === "instructor") navigate("/tutor/dashboard");
    else navigate("/dashboard");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          PyTech
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-gray-600 hover:text-blue-600 font-bold">Home</Link>
          <Link to="/about" className="text-gray-600 hover:text-blue-600 font-bold">About</Link>
          <Link to="/courses" className="text-gray-600 hover:text-blue-600 font-bold">Courses</Link>
          <Link to="/services" className="text-gray-600 hover:text-blue-600 font-bold">Services</Link>
          <Link to="/certification" className="text-gray-600 hover:text-blue-600 font-bold">Certification</Link>
        </div>

        {/* Auth/Profile - Desktop */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          {auth && auth.username ? (
            <div
              className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-extrabold"
              onClick={() => setOpenDropdown(!openDropdown)}
              title={auth.username}
            >
              {auth.username.charAt(0).toUpperCase()}
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
          {openDropdown && auth && auth.username && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg py-2 z-50">
              <div className="px-4 py-2 text-gray-700 font-medium capitalize">
                {auth.username} - {auth.role}
              </div>
              <hr />
              <button
                onClick={handleDashboard}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Dashboard
              </button>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            className="text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white shadow">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium">Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium">About</Link>
          <Link to="/courses" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium">Courses</Link>
          <Link to="/services" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium">Services</Link>
          <Link to="/certification" onClick={() => setMenuOpen(false)} className="block text-gray-700 font-medium">Certification</Link>

          <hr />

          {auth && auth.username ? (
            <>
              <div className="text-gray-600 font-medium capitalize">
                {auth.username} - {auth.role}
              </div>
              <button
                onClick={() => {
                  handleDashboard();
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-blue-600 hover:underline"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-red-600 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-blue-600">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block text-blue-600">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
