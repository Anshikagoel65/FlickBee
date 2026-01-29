import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/config";

let recaptchaVerifierInstance = null;

const getRecaptchaVerifier = () => {
  if (!recaptchaVerifierInstance) {
    recaptchaVerifierInstance = new RecaptchaVerifier(
      "recaptcha-container", // ✅ container FIRST
      {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA verified");
        },
      },
      auth, // ✅ auth LAST
    );
  }
  return recaptchaVerifierInstance;
};

export const sendOtp = async (phone) => {
  try {
    const verifier = getRecaptchaVerifier();
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      verifier,
    );
    return confirmationResult;
  } catch (error) {
    if (recaptchaVerifierInstance) {
      recaptchaVerifierInstance.clear();
      recaptchaVerifierInstance = null;
    }
    throw error;
  }
};

export const verifyOtp = async (confirmationResult, otp) => {
  const result = await confirmationResult.confirm(otp);
  const token = await result.user.getIdToken();

  return {
    token,
    phone: result.user.phoneNumber,
    user: result.user,
  };
};
