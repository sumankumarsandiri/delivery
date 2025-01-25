const blackListTokenSchema = require("../schemas/blackListTokenSchema");
const captainSchema = require("../schemas/captainSchema");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");

const registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let context = {
    success: 1,
    message: "Captain registered successfully",
    data: {},
    status: 200,
  };

  try {
    console.log(req.body);
    const { email, fullname, password, vehicle } = req.body;

    // Check if the captain already exists
    const existingCaptain = await captainSchema.findOne({ email });
    if (existingCaptain) {
      throw new Error("Captain already exist");
    }

    const hashedPassword = await captainSchema.hashPassword(password);

    const newCaptain = await captainService.createCaptain({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword,
      color: vehicle.color,
      plate: vehicle.plate,
      capacity: vehicle.capacity,
      vehicleType: vehicle.vehicleType,
    });

    // newCaptain.password = hashedPassword;

    // Generate an authentication token
    const token = newCaptain.generateAuthToken();

    // Save the user to the database
    await newCaptain.save();

    // Add user data and token to the context
    context.data = { captain: newCaptain, token };

    console.log("Captain registered successfully:", context.data);

    // res.status(201).json(context);
  } catch (err) {
    console.error("Error during registration:", err.message);

    context.success = 0;
    context.message = err.message || "An error occurred during registration";
    context.status = err.message === "Captain already registered" ? 409 : 500;

    res.status(context.status).json(context);
    // return res.status(context.status).json(context);
  }

  //   context = response(context);
  res.status(200).send(context);
};

const loginCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let context = {
    success: 1,
    message: "Captain logged in successfully",
    data: {},
    status: 200,
  };
  try {
    const { email, password } = req.body;

    const captain = await captainSchema.findOne({ email }).select("+password");

    if (!captain) {
      throw new Error("Invalid credentials");
    }
    // Check if password matches
    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = captain.generateAuthToken();

    res.cookie("token", token);

    context.data = { captain, token };
    console.log("Captain logged in successfully:", context.data);
  } catch (err) {
    context.success = 0;
    context.message = error.message || error.toString();
    res.status(context.status).json(context);
  }
  res.status(200).send(context);
};

const getCaptainProfile = async (req, res, next) => {
  res.status(200).json({ captain: req.captain });
};

const logoutCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  await blackListTokenSchema.create({ token });
  res.clearCookie("token");
  res.status(200).json({ message: "Captain logged out successfully" });
};

module.exports = {
  registerCaptain,
  loginCaptain,
  getCaptainProfile,
  logoutCaptain,
};
