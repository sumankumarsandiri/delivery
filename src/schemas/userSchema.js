const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const { select } = require("underscore");

const userSchema = new mongoose.Schema(
  {
    fullname: String,
    email: { type: String, required: true, unique: true },
    mobileNumber: String,
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "deliveryPerson", "admin"],
      default: "customer",
    },
    socketId: {
      type: String,
    },
    // created_at: {
    //   type: Date,
    //   default: Date.now,
    // },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery", // Reference to the clients collection
        required: false,
      },
    ],
    last_Login: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }
  );
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

userSchema.methods.hashPassword = async function (password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
