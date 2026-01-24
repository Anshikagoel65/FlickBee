import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [postLoginAction, setPostLoginAction] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isAuthenticated = !!user;

  // ✅ LOAD USER FROM LOCAL STORAGE ON REFRESH
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      setAuthLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        logout();
      } else {
        setUser({ ...JSON.parse(savedUser), token });
      }
    } catch (err) {
      logout();
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user?.token) return;

    const decoded = jwtDecode(user.token);
    const expiryTime = decoded.exp * 1000;
    const timeout = expiryTime - Date.now();

    if (timeout <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(logout, timeout);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setIsLoginOpen(true); // optional: open login modal
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  // ✅ CALL THIS AFTER OTP VERIFY
  const login = (token, phone) => {
    const userData = { phone };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsLoginOpen(false);

    setPostLoginAction((action) => {
      if (action) action();
      return null;
    });
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoginOpen,
        setIsLoginOpen,
        phone,
        setPhone,
        otpSent,
        setOtpSent,
        user,
        login,
        logout,
        postLoginAction,
        setPostLoginAction,
        isAuthenticated,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
