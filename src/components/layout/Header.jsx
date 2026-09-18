import { Dropdown, Layout } from "antd";
import { Bell, ChevronsRight, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { actionIcon } from "../icons/menuIcon";
import defaultProfileImage from "../../assets/profile-image.png";
import { PATH } from "../../constants/PATH";

const { Header: AntHeader } = Layout;

export default function Header({
  sidebarCollapsed,
  setSidebarCollapsed,
  user,
  onLogout,
  variant = "admin",
}) {
  const navigate = useNavigate();
  const displayName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Account";
  const isVendor = variant === "vendor";

  const profilePath = isVendor ? PATH.VENDOR_PROFILE : PATH.ADMIN_DASHBOARD;
  const settingsPath = isVendor ? PATH.VENDOR_SETTINGS : PATH.ADMIN_CATEGORIES;

  const menuItems = [
    {
      key: "profile",
      label: "Profile",
      icon: actionIcon(User),
      onClick: () => navigate(profilePath),
    },
    {
      key: "settings",
      label: "Settings",
      icon: actionIcon(Settings),
      onClick: () => navigate(settingsPath),
    },
    { type: "divider" },
    {
      key: "logout",
      label: "Sign out",
      icon: actionIcon(LogOut),
      danger: true,
      onClick: onLogout,
    },
  ];

  return (
    <AntHeader className="dashboard-header !h-14 !bg-white !px-0">
      <div className="dashboard-header-inner">
        <div className="flex min-w-0 flex-1 items-center">
          {sidebarCollapsed ? (
            <button
              type="button"
              aria-label="Expand sidebar"
              className="dashboard-sidebar-toggle"
              onClick={() => setSidebarCollapsed(false)}
            >
              {actionIcon(ChevronsRight, 20)}
            </button>
          ) : null}
        </div>

        <div className="dashboard-header-actions">
          <button
            type="button"
            aria-label="Notifications"
            className="dashboard-icon-btn relative"
          >
            {actionIcon(Bell, 20)}
            <span className="dashboard-notification-dot" aria-hidden />
          </button>

          <div className="dashboard-user-area">
            <div className="dashboard-user-text">
              <span className="dashboard-user-name">{displayName}</span>
              {user?.email ? (
                <span className="dashboard-user-email">{user.email}</span>
              ) : null}
            </div>

            <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
              <button
                type="button"
                aria-label="Open account menu"
                className="dashboard-profile-btn"
              >
                <img
                  src={user?.profileImage || defaultProfileImage}
                  alt=""
                  className="dashboard-user-avatar"
                />
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
    </AntHeader>
  );
}
