const express = require("express");
const router = express.Router();
const { body, query } = require("express-validator");
const rideController = require("../src/controllers/ride.controller");
const authMiddleware = require("../src/middleware/authMiddleware");

router.post(
  "/create",
  authMiddleware.authuser,
  body("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  body("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  body("vehicleType")
    .isString()
    .isIn(["auto", "car", "moto"])
    .withMessage("Invalid vehicle type"),
  rideController.createRide
);

router.get(
  "/get-fare",
  authMiddleware.authuser,
  query("pickup")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid pickup address"),
  query("destination")
    .isString()
    .isLength({ min: 3 })
    .withMessage("Invalid destination address"),
  rideController.getFare
);

router.post(
  "/confirm",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  rideController.confirmRide
);

router.get(
  "/pickup-ride",
  authMiddleware.authCaptain,
  query("rideId").isMongoId().withMessage("Invalid ride id"),
  query("otp")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid OTP"),
  rideController.startRide
);

router.post(
  "/end-ride",
  authMiddleware.authCaptain,
  body("rideId").isMongoId().withMessage("Invalid ride id"),
  body("deliveryOtp")
    .notEmpty()
    .isLength({ min: 6, max: 6 })
    .withMessage("Invalid delivery OTP"),
  rideController.endRide
);

module.exports = router;
