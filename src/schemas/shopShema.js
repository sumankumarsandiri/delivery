const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: String,
  address: String,
  location: {
    lat: Number,
    lng: Number,
  },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
});

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
