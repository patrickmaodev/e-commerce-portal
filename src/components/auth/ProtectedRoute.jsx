import { Navigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";

export default function ProtectedRoute({ children, allowedRole, loginPath }) {
  const { token, user, isAuthLoading } = useStateContext();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to={loginPath} replace />;
  }

  if (allowedRole && user.roleName !== allowedRole) {
    return <Navigate to={loginPath} replace />;
  }

  return children;
}
