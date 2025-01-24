const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

const deliverySchema = new mongoose.Schema({
  customerName: String,
  customerAddress: String,
  customerLocation: {
    lat: Number,
    lng: Number,
  },
  shopId: mongoose.Schema.Types.ObjectId,
  items: [
    {
      name: String,
      quantity: Number,
    },
  ],
  deliveryStatus: {
    type: String,
    enum: ["Pending", "In Progress", "Delivered"],
    default: "Pending",
  },
  driverLocation: {
    lat: Number,
    lng: Number,
  },
  tracking: [
    {
      timestamp: Date,
      location: {
        lat: Number,
        lng: Number,
      },
    },
  ],
});

const Delivery = mongoose.model("Delivery", deliverySchema);

module.exports = Delivery;
