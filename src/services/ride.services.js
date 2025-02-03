const rideModel = require("../schemas/rideSchema");
const mongoose = require("mongoose");
const mapService = require("./maps.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const _ = require("underscore");

const getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination);

  const baseFare = {
    auto: 30,
    car: 50,
    moto: 20,
  };

  const perKmRate = {
    auto: 10,
    car: 15,
    moto: 8,
  };

  const perMinuteRate = {
    auto: 2,
    car: 3,
    moto: 1.5,
  };

  const fare = {
    auto: Math.round(
      baseFare.auto +
        (distanceTime.distance.value / 1000) * perKmRate.auto +
        (distanceTime.duration.value / 60) * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        (distanceTime.distance.value / 1000) * perKmRate.car +
        (distanceTime.duration.value / 60) * perMinuteRate.car
    ),
    moto: Math.round(
      baseFare.moto +
        (distanceTime.distance.value / 1000) * perKmRate.moto +
        (distanceTime.duration.value / 60) * perMinuteRate.moto
    ),
  };

  return fare;
};

// module.exports.getFare = getFare;

function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString();
    return otp;
  }
  return generateOtp(num);
}

const createRide = async ({ user, pickup, destination, vehicleType }) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);

  const ride = rideModel.create({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });

  return ride;
};

const confirmRide = async ({ rideId, captain }) => {
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  // Update the ride status and assign the captain
  const ride = await rideModel
    .findOneAndUpdate(
      { _id: rideId },
      {
        status: "accepted",
        captain: captain._id,
      },
      { new: true } // Return the updated document
    )
    .populate("user")
    .populate("captain")
    .select("+otp");

  if (!ride) {
    throw new Error("Ride not found.");
  }

  return ride;
};

const startRide = async ({ rideId, otp, captain }) => {
  const context = {
    success: 1,
    message: "Ride started successfully",
    data: {},
  };
  if (!rideId || !otp) {
    throw new Error("Ride id and OTP are required");
  }

  const ride = await rideModel
    .findOne({
      _id: rideId,
    })

    .populate({
      path: "user",
      select: "_id fullname email destination fare status pickup", // Selecting only required fields from user
    })

    .populate({
      path: "captain",
      select: "fullname email vehicle status", // Selecting only required fields from user
    })
    .select("+otp");

  // console.log("checking ride..........:", ride);

  if (!ride) {
    throw new Error("Ride not found");
  }

  // if (ride.status !== "accepted") {
  //   throw new Error("Ride not accepted");
  // }

  if (ride.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  // Update the ride status to "ongoing"
  const updatedRide = await rideModel
    .findOneAndUpdate(
      { _id: rideId },
      { status: "ongoing" },
      { new: true } // Returns the updated ride document
    )
    .populate({
      path: "user",
      select: "_id fullname email destination fare status pickup", // Selecting only required fields from user
    })
    .populate({
      path: "captain",
      select: "fullname.firstname fullname.lastname email vehicle", // Selecting only required fields from user
    });

  if (!updatedRide) {
    throw new Error("Failed to update ride status");
  }

  updatedRide.save();
  // console.log("updated", updatedRide);

  // console.log("RIDE STATUS:", ride.status);

  // Assign updated ride data to the context
  context.data = updatedRide;

  return context;
};

const endRide = async ({ rideId, captain }) => {
  const context = {
    success: 1,
    message: "pickupRide ended successfully",
    data: {},
  };

  // Validate input
  if (!rideId) {
    throw new Error("Ride id is required");
  }

  // if (!rideId) {
  //   throw new Error("Ride id is required");
  // }

  // const ride = await rideModel
  //   .findOne({
  //     _id: rideId,
  //     captain: captain._id,
  //   })

  const ride = await rideModel
    // .findOne({
    //   _id: rideId,
    //   captain_id: captain._id,
    // })
    .findOne({
      _id: rideId,
    })
    .populate({
      path: "user",
      select: "_id fullname email destination fare status pickup", // Selecting only required fields from user
    })
    .populate({
      path: "captain",
      select: "_id fullname email vehicle status", // Selecting only required fields from user
    })
    .select("+otp");
  console.log(ride, "ride");

  if (!ride) {
    throw new Error("Ride not found");
  }

  // if (!ride.status || ride.status !== "ongoing") {
  //   throw new Error("Ride not ongoing");
  // }
  const updateRide = await rideModel.findOneAndUpdate(
    { _id: rideId },
    { status: "completed" },
    { new: true }
  );

  console.log(updateRide, "updateRide");
  if (!updateRide) {
    throw new Error("Failed to update ride status");
  }
  updateRide.save();
  console.log("updated", updateRide);
  context.data = updateRide;

  return context;
};

module.exports = {
  createRide,
  getFare,
  getOtp,
  confirmRide,
  startRide,
  endRide,
};
