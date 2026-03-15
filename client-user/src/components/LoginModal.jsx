import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { sendOtp, verifyOtp } from "../services/authApi";
import toast from "react-hot-toast";

const LoginModal = () => {
  const { login, setIsLoginOpen, postLoginAction, setPostLoginAction } =
    useAuthContext();
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      toast.error("Enter a valid mobile number");
      return;
    }

    setLoading(true);

    const toastId = toast.loading("Sending OTP...");

    try {
      await sendOtp(`+91${phone}`);

      toast.success("OTP sent successfully 📩", { id: toastId });

      setStep("otp");

      startTimer();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error("Enter valid OTP");
      return;
    }
    setVerifyLoading(true);
    const toastId = toast.loading("Verifying OTP...");
    try {
      const { token, phone: userPhone } = await verifyOtp(`+91${phone}`, otp);

      login(token, userPhone);

      toast.success("Successfully logged in 🎉", { id: toastId });

      setTimeout(() => {
        setIsLoginOpen(false);
        if (postLoginAction) {
          postLoginAction();
          setPostLoginAction(null);
        }
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP", {
        id: toastId,
      });
    } finally {
      setVerifyLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[360px] p-6 relative">
        <button
          className="absolute top-3 right-4 text-xl"
          onClick={() => setIsLoginOpen(false)}
        >
          ✕
        </button>

        {step === "phone" && (
          <>
            <h2 className="text-xl font-bold mb-2">Login or Sign Up</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter your mobile number to continue
            </p>

            <input
              type="tel"
              maxLength="10"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              className="w-full border px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-1 focus:ring-green-500"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-xl font-bold mb-2">Verify OTP</h2>
            <p className="text-sm text-gray-600 mb-4">
              OTP sent to +91 {phone}
            </p>

            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="w-full border px-4 py-2 rounded-lg mb-3 text-center tracking-widest text-lg"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={verifyLoading}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400"
            >
              {verifyLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center mt-3 text-sm">
              {timer > 0 ? (
                <span className="text-gray-500">Resend OTP in {timer}s</span>
              ) : (
                <button
                  className="text-green-600 font-medium"
                  disabled={loading}
                  onClick={handleSendOtp}
                >
                  {loading ? "Sending..." : "Resend OTP"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
