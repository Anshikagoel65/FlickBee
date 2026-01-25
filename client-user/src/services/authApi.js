import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/config";

let recaptchaVerifierInstance = null;

const getRecaptchaVerifier = () => {
  if (!recaptchaVerifierInstance) {
    recaptchaVerifierInstance = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {},
      },
    );

    recaptchaVerifierInstance.render();
  }

  return recaptchaVerifierInstance;
};

export const resetRecaptcha = async () => {
  if (recaptchaVerifierInstance) {
    await recaptchaVerifierInstance.clear();
    recaptchaVerifierInstance = null;
  }
};

export const sendOtp = async (phone) => {
  try {
    const verifier = getRecaptchaVerifier();
    return await signInWithPhoneNumber(auth, phone, verifier);
  } catch (error) {
    console.error("Firebase OTP error:", error);
    await resetRecaptcha();
    throw error;
  }
};

export const verifyOtp = async (confirmationResult, otp) => {
  const credential = await confirmationResult.confirm(otp);
  const token = await credential.user.getIdToken();

  return {
    token,
    phone: credential.user.phoneNumber,
    user: credential.user,
  };
};
