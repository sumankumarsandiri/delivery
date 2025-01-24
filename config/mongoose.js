const mongoose = require("mongoose");
require("dotenv").config();
// Connect to MongoDB
const connectMongo = async () => {
  const uri = process.env.MONGO_URI;
  console.log("MongoDB URI:", uri);

  if (!uri) {
    throw new Error(
      "MongoDB URI is undefined. Check your environment variables."
    );
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  }
};
module.exports = connectMongo;
