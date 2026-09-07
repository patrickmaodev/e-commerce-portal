import { createContext, useContext, useState, useEffect } from "react";
import { registerLogoutHandler } from "../utils/authBridge";

const StateContext = createContext({
  user: null,
  token: null,
  isAuthLoading: true,
  setUser: () => {},
  setToken: () => {},
  logout: () => {},
});

export const ContextProvider = ({ children }) => {
  const [user, setUserInternal] = useState(null);
  const [token, setTokenInternal] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("ACCESS_TOKEN");
    const savedUser = localStorage.getItem("USER_DATA");

    if (savedToken) {
      setTokenInternal(savedToken);
    }

    if (savedUser) {
      try {
        setUserInternal(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("USER_DATA");
      }
    }

    setIsAuthLoading(false);
  }, []);

  const setToken = (newToken) => {
    setTokenInternal(newToken);
    if (newToken) {
      localStorage.setItem("ACCESS_TOKEN", newToken);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  const setUser = (newUser) => {
    setUserInternal(newUser);
    if (newUser) {
      localStorage.setItem("USER_DATA", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("USER_DATA");
    }
  };

  const logout = () => {
    setUserInternal(null);
    setTokenInternal(null);
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("USER_DATA");
  };

  useEffect(() => {
    registerLogoutHandler(logout);
  }, []);

  return (
    <StateContext.Provider
      value={{
        user,
        token,
        isAuthLoading,
        setUser,
        setToken,
        logout,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
export const useAuth = useStateContext;

export default ContextProvider;
