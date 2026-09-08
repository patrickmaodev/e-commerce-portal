import LoginForm from "../../components/auth/LoginForm";
import { authService } from "../../services/auth/authService";
import { ROLES } from "../../constants/ROLES";
import { PATH } from "../../constants/PATH";

export default function AdminLogin() {
  return (
    <LoginForm
      title="Admin Login"
      loginFn={authService.adminLogin}
      expectedRole={ROLES.SUPERADMIN}
      redirectPath={PATH.ADMIN_DASHBOARD}
      fallbackPath={PATH.AUTH_ADMIN_LOGIN}
    />
  );
}
