const express = require("express");
const logger = require("morgan");
require("dotenv").config();
const path = require("path");
var cookieParser = require("cookie-parser");
const cors = require("cors");
const connectMongo = require("../config/mongoose");
const indexRouter = require("../routes/index");
const authRouter = require("../routes/userAuth");
const captainRoute = require("../routes/captain.routes");
const mapRoutes = require("../routes/maps.routes");
const rideRoutes = require("../routes/ride.routes");

const app = express();

connectMongo();

app.use(cors({ origin: true }));

// view engine setup
app.set("views", path.join(__dirname, "views")); // Specify views directory
// Set EJS as the template engine  (ejs is more powerful than Jade)  -- "ejs" is the extension for EJS files.  Jade is not used anymore.  Jade is a templating engine for Node.js, which is less powerful than EJS
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
// Routes

app.use("/", indexRouter);
app.use("/auth", authRouter);
// captain is driver
app.use("/captain", captainRoute);
app.use("/maps", mapRoutes);
app.use("/ride", rideRoutes);

// Error handler
app.use((err, req, res, next) => {
  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: req.app.get("env") === "development" ? err : {},
  });
});
module.exports = app;
