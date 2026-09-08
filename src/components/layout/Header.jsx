import { FaBars, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import defaultProfileImage from "../../assets/profile-image.png";

export default function Header({ sidebarVisible, setSidebarVisible, user, onLogout }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-[#4F3CC9] to-purple-500 shadow-md text-white">
      <button
        className="text-2xl text-white hover:text-[#000000] transition-transform transform hover:scale-110"
        onClick={() => setSidebarVisible((prev) => !prev)}
      >
        {sidebarVisible ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className="flex items-center gap-3 relative"
        onMouseEnter={() => setDropdownVisible(true)}
        onMouseLeave={() => setDropdownVisible(false)}
      >
        <span className="text-lg font-semibold">
          Welcome, {user?.firstName} {user?.lastName}
        </span>

        <img
          src={user?.profileImage || defaultProfileImage}
          alt="Profile"
          className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
        />

        {dropdownVisible && (
          <div className="absolute right-0 top-12 bg-white text-black shadow-lg rounded-lg py-2 w-48 z-20">
            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 rounded-md"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
