const admin = require("../config/firebase"); // firebase-admin init

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      phone: decoded.phone_number,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Firebase token" });
  }
};

module.exports = authMiddleware;
