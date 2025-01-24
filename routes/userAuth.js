const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const authMiddleware = require("../src/middleware/authMiddleware");
const userController = require("../src/controllers/user.controller");

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname")
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("fullName is required"),
    // body("mobileNumber").isMobilePhone().withMessage("Invalid Mobile Number"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.registerUser
);
//==checking user is stored or not
router.get(
  "/userChecking",
  authMiddleware.authMiddleware,
  userController.userCheck
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  userController.loginUser
);
router.get("/profile", authMiddleware.authuser, userController.getUserProfile);
router.get("/logout", authMiddleware.authuser, userController.logoutUser);

module.exports = router;
