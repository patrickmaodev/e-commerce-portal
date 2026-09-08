import LoginForm from "../../components/auth/LoginForm";
import { authService } from "../../services/auth/authService";
import { ROLES } from "../../constants/ROLES";
import { PATH } from "../../constants/PATH";

export default function VendorLogin() {
  return (
    <LoginForm
      title="Vendor Login"
      loginFn={authService.vendorLogin}
      expectedRole={ROLES.VENDOR}
      redirectPath={PATH.VENDOR_DASHBOARD}
      fallbackPath={PATH.AUTH_VENDOR_LOGIN}
      registerLink={{ to: PATH.AUTH_REGISTER, label: "Create an account" }}
    />
  );
}
