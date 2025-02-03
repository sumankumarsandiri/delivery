const rideService = require("../services/ride.services");
const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");
const { sendMessageToSocketId } = require("../socket");
const rideModel = require("../schemas/rideSchema");

const createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: req.user._id,
      pickup,
      destination,
      vehicleType,
    });
    res.status(201).json(ride);

    const pickupCoordinates = await mapService.getAddressCoordinates(pickup);
    if (
      !pickupCoordinates ||
      !pickupCoordinates.lat ||
      !pickupCoordinates.lng
    ) {
      console.error("Invalid pickup coordinates received.");
      return;
    }

    console.log("Pickup Coordinates:", pickupCoordinates);

    const captainsInRadius = await mapService.getCaptainsInTheRadius(
      pickupCoordinates.ltd,
      pickupCoordinates.lng,
      2
    );
    console.log("Captains Found:", captainsInRadius);

    if (!captainsInRadius || captainsInRadius.length === 0) {
      console.log("No captains found in the radius.");
      return;
    }

    ride.otp = "";

    const rideWithUser = await rideModel
      .findOne({ _id: ride._id })
      .populate("user");

    captainsInRadius.map((captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  try {
    const fare = await rideService.getFare(pickup, destination);
    return res.status(200).json({ fare });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let context = {
    success: 1,
    message: "Ride confirmed successfully",
    data: {},
    status: 200,
  };
  const { rideId } = req.body;

  if (!rideId) {
    return res
      .status(400)
      .json({ success: 0, message: "Ride ID is required." });
  }

  if (!req.captain || !req.captain._id) {
    return res
      .status(400)
      .json({ success: 0, message: "Captain details are missing." });
  }

  try {
    const ride = await rideService.confirmRide({
      rideId,
      captain: req.captain,
    });

    if (ride.user.socketId) {
      sendMessageToSocketId(ride.user.socketId, {
        event: "ride-confirmed",
        data: ride,
      });
    } else {
      console.warn(`User ${ride.user._id} does not have a socketId.`);
    }

    // return res.status(200).json(ride);

    context.data = ride;
    console.log("Ride confirmed successfully:", ride);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
  //   context = response(context);
  res.status(200).send(context);
};

const startRide = async (req, res) => {
  const context = {
    success: 1,
    message: "Ride started successfully",
    data: {},
    status: 200,
  };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.query;

  if (!rideId || !otp) {
    return res.status(400).json({
      success: 0,
      message: "Ride ID and OTP are required",
    });
  }

  try {
    const ride = await rideService.startRide({
      rideId,
      otp,
      captain: req.captain,
    });

    console.log(ride);
    // Check if the ride exists and ensure user socketId exists before sending the message
    // if (!ride || !ride.user || !ride.user.socketId) {
    //   throw new Error("User or socketId not found");
    // }

    // sendMessageToSocketId(ride.user.socketId, {
    //   event: "ride-started",
    //   data: ride,
    // });

    context.data = ride.data;
    console.log("Ride started successfully:", ride);
    // return res.status(200).json(context);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.status(200).send(context);
};

const endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });

    // sendMessageToSocketId(ride.user.socketId, {
    //   event: "ride-ended",
    //   data: ride,
    // });

    return res.status(200).json(ride);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createRide,
  getFare,
  confirmRide,
  startRide,
  endRide,
};
