import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import { ChevronsLeft } from "lucide-react";
import { actionIcon } from "../icons/menuIcon";
import {
  getMenuItemsForRole,
  getOpenMenuKeys,
  getSelectedMenuKey,
} from "../../config/dashboardMenus";

const { Sider } = Layout;

export default function Sidebar({ collapsed, onCollapse, role, variant }) {
  const navigate = useNavigate();
  const location = useLocation();
  const items = useMemo(() => getMenuItemsForRole(role), [role]);

  const selectedKeys = useMemo(
    () => getSelectedMenuKey(location.pathname, items),
    [location.pathname, items]
  );

  const [openKeys, setOpenKeys] = useState(() => getOpenMenuKeys(location.pathname));

  useEffect(() => {
    if (!collapsed) {
      setOpenKeys((prev) => {
        const fromPath = getOpenMenuKeys(location.pathname);
        return [...new Set([...prev, ...fromPath])];
      });
    }
  }, [location.pathname, collapsed]);

  const panelTitle = variant === "admin" ? "Admin" : "Vendor";

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={252}
      collapsedWidth={72}
      className="dashboard-sider !fixed !left-0 !top-0 !z-40 !h-screen"
      theme="dark"
    >
      <div
        className={`dashboard-sider-brand ${
          collapsed ? "justify-center px-0" : "px-4"
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500 text-sm font-bold text-white">
            C
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white">Commerce</div>
              <div className="truncate text-xs text-slate-400">{panelTitle}</div>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            type="button"
            aria-label="Collapse sidebar"
            className="dashboard-sidebar-toggle dashboard-sidebar-toggle--on-dark"
            onClick={() => onCollapse(true)}
          >
            {actionIcon(ChevronsLeft, 20)}
          </button>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        items={items}
        selectedKeys={selectedKeys}
        openKeys={collapsed ? [] : openKeys}
        onOpenChange={setOpenKeys}
        onClick={({ key }) => {
          if (key.startsWith("/")) {
            navigate(key);
          }
        }}
        className="dashboard-menu custom-scrollbar"
        style={{ background: "transparent" }}
      />
    </Sider>
  );
}
