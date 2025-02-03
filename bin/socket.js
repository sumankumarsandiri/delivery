const socketIo = require("socket.io");
const socketIoClient = require("socket.io-client");
const userSchema = require("../src/schemas/userSchema");
const captainSchema = require("../src/schemas/captainSchema");

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
          await userSchema.findByIdAndUpdate(userId, { socketId: socket.id });
        } else if (userType === "captain") {
          await captainSchema.findByIdAndUpdate(userId, {
            socketId: socket.id,
          });
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

// =======================================
// Initialize Socket.IO server and connect the client internally
function connectClient() {
  // Create a client to connect to the server (this acts like the frontend connecting to the backend)
  let socketClient = socketIoClient("http://localhost:3030");

  socketClient.on("connect", () => {
    console.log(`Client connected to server with socketId: ${socketClient.id}`);

    // Simulate sending 'join' event with userId and userType
    // const userData = {
    //   userId: "12345", // Example user ID
    //   userType: "user", // Either 'user' or 'captain'
    // };
    // const { userId, userType } = data;
    // const userData = {
    //   userId: userId, // Example user ID
    //   userType: userType, // Either 'user' or 'captain'
    // };
    socketClient.on("join", () => {
      try {
        const { userId, userType } = data;

        // Validate input
        if (!userId || !userType) {
          return socketClient.emit("error", {
            message: "Missing userId or userType",
          });
        }
      } catch (error) {}
    });

    socketClient.emit("join", userData);

    // Listen for the 'error' or success event
    socketClient.on("error", (data) => {
      console.error("Error:", data.message);
    });

    socketClient.on("location-updated", (data) => {
      console.log(data.message);
    });
  });

  socketClient.on("disconnect", () => {
    console.log("Disconnected from server");
  });
}

//++++++

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

// =======================================
// // Connect to the socket server
// const socket = socketIoClient("http://localhost:3000");

// socket.on("connect", () => {
//   console.log(`Connected to server with socketId: ${socket.id}`);

//   // Simulate sending 'join' event with userId and userType
//   const userData = {
//     userId: "12345",  // Example user ID
//     userType: "user",  // Either 'user' or 'captain'
//   };

//   socket.emit("join", userData);

//   // Listen for the 'error' or success event
//   socket.on("error", (data) => {
//     console.error("Error:", data.message);
//   });

//   socket.on("location-updated", (data) => {
//     console.log(data.message);
//   });
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected from server");
// });

// =================================================================

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
  connectClient, // Connect to the client internally
};
