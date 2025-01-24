const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../schemas/userSchema");

const authMiddleware = (req, res, next) => {
  let context = {
    success: 1,
    message: "User authenticated successfully",
    data: {},
  };

  try {
    // Extract Authorization header
    const headers = req.headers["authorization"];
    if (!headers) {
      return res.status(401).json({
        success: 0,
        message: "Authorization header is missing.",
      });
    }

    // Extract the token from the header
    const token = headers.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: 0,
        message: "Authorization token is missing.",
      });
    }

    console.log("Token extracted:", token); // Debug log

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded);
    // If token is valid, store decoded data in req.user
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error during token verification:", err); // Debug log
    return res
      .status(401)
      .json({ success: 0, message: "Invalid or expired token" });
  }
};

const authuser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: 0,
      message: "Unauthorized",
    });
  }
  const isBlackListed = await User.findOne({ token: token });

  if (isBlackListed) {
    return res.status(401).json({
      success: 0,
      message: "Unauthorized ",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded._id);
    req.user = user;
    return next();
  } catch (err) {
    res.status(401).json({
      success: 0,
      message: "Invalid token",
    });
  }
};

module.exports = { authMiddleware, authuser };
