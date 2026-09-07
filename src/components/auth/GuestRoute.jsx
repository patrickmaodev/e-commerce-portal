import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { ROLES } from "../../constants/ROLES";
import { PATH } from "../../constants/PATH";

export default function GuestRoute() {
  const { token, user, isAuthLoading } = useStateContext();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (token && user) {
    if (user.roleName === ROLES.SUPERADMIN) {
      return <Navigate to={PATH.ADMIN_DASHBOARD} replace />;
    }
    if (user.roleName === ROLES.VENDOR) {
      return <Navigate to={PATH.VENDOR_DASHBOARD} replace />;
    }
  }

  return <Outlet />;
}
