const { response } = require("../../core/response");
const userSchema = require("../schemas/userSchema");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenSchema = require("../schemas/blackListTokenSchema"); //

// =================================================================
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let context = {
    success: 1,
    message: "User registered successfully",
    data: {},
    status: 200,
  };

  try {
    console.log(req.body);
    const { email, fullname, password } = req.body;

    const newUser = await userService.createUser({
      fullname,
      email,
      password,
    });
    const hashedPassword = await newUser.hashPassword(password);

    newUser.password = hashedPassword;
    // Generate an authentication token
    const token = newUser.generateAuthToken();

    // Save the user to the database
    await newUser.save();

    // Add user data and token to the context
    context.data = { user: newUser, token };

    // res.status(201).json(context);
  } catch (err) {
    console.error("Error during registration:", err.message);

    context.success = 0;
    context.message = err.message || "An error occurred during registration";
    context.status = err.message === "User already registered" ? 409 : 500;

    res.status(context.status).json(context);
  }
  context = response(context);
  res.status(200).send(context);
};

const userCheck = async (req, res, next) => {
  let context = {
    success: 1,
    message: "User found successfully",
    data: {},
    status: 200,
  };

  try {
    const reqUser = req.user;
    const userInfo = await userService.getUser(reqUser);
    if (!userInfo.success) {
      throw new Error(userInfo.message);
    }
    context.data = userInfo.data;
    console.log(response(context));
  } catch (error) {
    context.success = 0;
    context.message = error.message || error.toString();
  }
  context = response(context);
  res.status(200).send(context); // Send the final response
};

const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let context = {
    success: 1,
    message: "User logged in successfully",
    data: {},
    status: 200,
  };
  try {
    const { email, password } = req.body;
    const user = await userSchema.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    const token = user.generateAuthToken();

    res.cookie("token", token);
    context.data = { user, token };
  } catch (error) {
    context.success = 0;
    context.message = error.message || error.toString();
  }
  context = response(context);
  res.status(200).send(context);
};

const getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

const logoutUser = async (req, res, next) => {
  res.clearCookie("token");
  const token = req.cookies.token || req.headers.authorization.split(" ")[1];

  await blackListTokenSchema.create({ token });

  res.status(200).json({ message: "User logged out successfully" });
};
// ?uhiuuyi
// =================================================================
module.exports = {
  registerUser,
  userCheck,
  loginUser,
  getUserProfile,
  logoutUser,
};
