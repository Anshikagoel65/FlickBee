import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [user, setUser] = useState(null);

  // ✅ LOAD USER FROM LOCAL STORAGE ON REFRESH
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
      setUser({
        ...JSON.parse(savedUser),
        token,
      });
    }
  }, []);

  // ✅ CALL THIS AFTER OTP VERIFY
  const login = (token, phone) => {
    localStorage.setItem("token", token);
    localStorage.setItem("phone", phone);

    setUser({
      token,
      phone,
    });
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMobile("");
    setOtpSent(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoginOpen,
        setIsLoginOpen,
        mobile,
        setMobile,
        otpSent,
        setOtpSent,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
