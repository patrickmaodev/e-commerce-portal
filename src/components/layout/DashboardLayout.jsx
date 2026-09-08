import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { useStateContext } from "../../contexts/ContextProvider";
import apiClient from "../../api/client";
import { PATH } from "../../constants/PATH";
import API from "../../constants/API";

export default function DashboardLayout({ variant = "admin" }) {
  const { user, logout } = useStateContext();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState({});

  const toggleSubMenu = (menu) => {
    setSubMenuOpen((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const onLogout = async (ev) => {
    ev.preventDefault();
    try {
      await apiClient.post(API.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
    }
  };

  const layoutId = variant === "admin" ? "adminLayout" : "vendorLayout";
  const heightClass = variant === "admin" ? "h-screen" : "min-h-screen";

  return (
    <div id={layoutId} className={`flex ${heightClass} bg-gray-200`}>
      <Sidebar
        toggleSubMenu={toggleSubMenu}
        subMenuOpen={subMenuOpen}
        PATH={PATH}
        sidebarVisible={sidebarVisible}
        role={user?.roleName}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
          user={user}
          onLogout={onLogout}
        />
        <main className="p-6 flex-1 overflow-y-auto max-h-screen">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
