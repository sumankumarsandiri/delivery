const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        minLength: [3, "Firstname must be at least 3 characters long"],
      },
      lastname: {
        type: String,
        minLength: [3, "Lastname must be at least 3 characters long"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email"],
      lowercase: true,
    },
    password: { type: String, required: true },
    mobileNumber: String,
    socketId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    vehicle: {
      color: { type: String, required: true },
      plate: {
        type: String,
        required: true,
        minLength: [3, "Plate must be at least 3 characters long"],
      },
      capacity: {
        type: Number,
        required: true,
        min: [1, "Capacity must be at least 1"],
      },
      vehicleType: {
        type: String,
        required: true,
        enum: ["bike", "car", "truck"],
      },
    },
    // location: {
    //   type: { type: String, enum: ["Point"], required: true },
    //   coordinates: { type: [Number], required: true },
    // },
    location: {
      ltd: { type: Number },
      lng: { type: Number },
    },
    deliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ride",
      },
    ],
    // orders: [
    //     {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Delivery", // Reference to the clients collection
    //     required: false,
    //     },
    // ],
    last_Login: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

captainSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  });
  return token;
};

captainSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};
// Create a 2dsphere index
captainSchema.index({ location: "2dsphere" });

const Captain = mongoose.model("captain", captainSchema);
module.exports = Captain;
