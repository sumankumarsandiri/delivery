const socketIo = require("socket.io");
const userSchema = require("./schemas/userSchema");
const captainSchema = require("./schemas/captainSchema");

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Listen for the 'join' event to update the socketId
    socket.on("join", async (data) => {
      try {
        const { userId, userType } = data;

        // Validate input
        if (!userId || !userType) {
          return socket.emit("error", {
            message: "Missing userId or userType",
          });
        }

        // Update the socketId in the database
        if (userType === "user") {
          const user = await userSchema.findById(userId);
          if (user) {
            user.socketId = socket.id;
            await user.save();
          } else {
            return socket.emit("error", { message: "User not found" });
          }
        } else if (userType === "captain") {
          const captain = await captainSchema.findById(userId);
          if (captain) {
            captain.socketId = socket.id;
            await captain.save();
          } else {
            return socket.emit("error", { message: "Captain not found" });
          }
        } else {
          return socket.emit("error", { message: "Invalid userType" });
        }
        console.log(
          `User ${userId} of type ${userType} joined with socketId: ${socket.id}`
        );
      } catch (error) {
        console.error("Error updating user socketId:", error);
        socket.emit("error", { message: "Failed to join socket" });
      }
    });

    // Listen for the 'update-location-captain' event to update captain's location
    socket.on("update-location-captain", async (data) => {
      try {
        const { userId, location } = data;

        // Validate location data
        if (
          !userId ||
          !location ||
          typeof location !== "object" ||
          !location.lat ||
          !location.lng
        ) {
          return socket.emit("error", { message: "Invalid location data" });
        }

        // Update the captain's location in the database
        await captainSchema.findByIdAndUpdate(userId, {
          location: {
            lat: location.lat,
            lng: location.lng,
          },
        });

        // Emit a confirmation message to the captain
        socket.emit("location-updated", {
          message: "Location updated successfully",
        });
      } catch (error) {
        console.error("Error updating location:", error);
        socket.emit("error", { message: "Failed to update location" });
      }
    });

    // Listen for the 'disconnect' event
    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

// Function to send messages to a specific socketId
const sendMessageToSocketId = (socketId, messageObject) => {
  try {
    if (!socketId || !messageObject.event || !messageObject.data) {
      console.error("Invalid socketId or messageObject");
      return;
    }

    if (io) {
      io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
      console.log("Socket.io not initialized.");
    }
  } catch (error) {
    console.error("Error sending message to socket:", error);
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
