const express = require("express");
const router = express.Router();
const authMiddleware = require("../src/middleware/authMiddleware");
const mapController = require("../src/controllers/map.controller");
const { query } = require("express-validator");

router.get(
  "/get-coordinates",
  [
    query("address").notEmpty().withMessage("Address is required"),
    query("address")
      .isLength({ min: 3 })
      .isString()
      .withMessage("Address should be at least 3 characters long"),
  ],
  mapController.getCoordinates
);

router.get(
  "/get-distance-time",
  query("origin").isString().isLength({ min: 3 }),
  query("destination").isString().isLength({ min: 3 }),
  authMiddleware.authuser,
  mapController.getDistanceTime
);

router.get(
  "/get-suggestions",
  query("input").isString().isLength({ min: 3 }),
  authMiddleware.authuser,
  mapController.getAutoComplete
);

module.exports = router;
