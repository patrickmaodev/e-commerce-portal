import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ConfigProvider, Layout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useStateContext } from "../../contexts/ContextProvider";
import apiClient from "../../api/client";
import API from "../../constants/API";
import { antdTheme } from "../../theme/antdTheme";

const { Content } = Layout;

const SIDER_WIDTH = 252;
const SIDER_COLLAPSED_WIDTH = 72;

export default function DashboardLayout({ variant = "admin" }) {
  const { user, logout } = useStateContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const onLogout = async () => {
    try {
      await apiClient.post(API.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      logout();
    }
  };

  const siderOffset = sidebarCollapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH;
  return (
    <ConfigProvider theme={antdTheme}>
      <Layout className="min-h-screen bg-slate-100">
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          role={user?.roleName}
          variant={variant}
        />

        <Layout
          className="dashboard-layout-main min-h-screen transition-[margin] duration-200"
          style={{ marginLeft: siderOffset }}
        >
          <Header
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            user={user}
            onLogout={onLogout}
            variant={variant}
          />

          <Content className="dashboard-content">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
