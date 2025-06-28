import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AdminNavbar = ({ title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (username && role) {
      setUser({ username, role });
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login"); 
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-5 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        <p className="text-lg text-gray-500">Admin control panel</p>
      </div>

      <div className="flex items-center space-x-16">
        <div className="hidden md:flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="px-6 py-2 rounded-full border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64 shadow-sm"
          />
        </div>

        <div className="relative" ref={dropdownRef}>
          {user && (
            <>
              <div
                className="cursor-pointer w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-extrabold"
                onClick={() => setOpenDropdown(!openDropdown)}
                title={user.username}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>

              {openDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50">
                  <div className="px-4 py-2 text-gray-700 font-medium">
                    {user.username} - {user.role}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
