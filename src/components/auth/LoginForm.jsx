import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import { authService } from "../../services/auth/authService";
import { getApiErrorMessage } from "../../api/errors";

export default function LoginForm({
  title,
  loginFn,
  expectedRole,
  redirectPath,
  fallbackPath,
  registerLink,
}) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setErrors(null);
    setLoading(true);

    try {
      const data = await loginFn({
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });

      setUser(data.user);
      setToken(data.token);

      if (data.user.roleName === expectedRole) {
        navigate(redirectPath);
      } else {
        navigate(fallbackPath);
      }

      emailRef.current.value = "";
      passwordRef.current.value = "";
    } catch (err) {
      const response = err.response;
      if (response?.status === 422 && response.data?.errors) {
        setErrors(response.data.errors);
      } else {
        setErrors({ generic: [getApiErrorMessage(err)] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form">
        <h1>{title}</h1>

        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key} className="text-sm text-red-500">
                {errors[key][0]}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label htmlFor="email">Email</label>
            <input ref={emailRef} id="email" type="email" placeholder="Email" required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input ref={passwordRef} id="password" type="password" placeholder="Password" required />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {registerLink && (
          <p className="text-center text-gray-600 mt-4">
            Not Registered?{" "}
            <Link to={registerLink.to} className="text-blue-600 hover:text-blue-800">
              {registerLink.label}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export { authService };
