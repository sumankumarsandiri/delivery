const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");

const getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  let context = {
    success: 1,
    message: "Coordinates retrieved successfully",
    data: {},
    status: 200,
  };
  try {
    const { address } = req.query;
    const coordinates = await mapService.getAddressCoordinates(address);
    context.data = coordinates;
    console.log("Coordinates retrieved successfully:", context.data);
    // context = response(context);

    next();
  } catch (error) {
    context.success = 0;
    context.message = error.message || error.toString();
    // context = response(context);
    res.status(context.status).json(context);
  }

  res.status(200).send(context);
};

// const getCoordinates = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ success: false, errors: errors.array() });
//   }

//   try {
//     const { address } = req.body;
//     const coordinates = await mapService.getAddressCoordinates(address);

//     return res.status(200).json({
//       success: 1,
//       message: "Coordinates retrieved successfully",
//       data: coordinates,
//       status: 200,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: 0,
//       message: error.message || "Internal Server Error",
//       status: 500,
//     });
//   }
// };

// const getCoordinates = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ success: false, errors: errors.array() });
//   }
//   let context = {
//     success: 1,
//     message: "Coordinates retrieved successfully",
//     data: {},
//     status: 200,
//   };
//   const { address } = req.query;
//   try {
//     const coordinates = await mapService.getAddressCoordinates(address);
//     context.data = coordinates;
//     console.log("Coordinates retrieved successfully:", context.data);
//     // context = response(context);
//     // next();
//   } catch (error) {
//     context.success = 0;
//     context.message = error.message || error.toString();
//     context = response(context);
//     res.status(context.status).json(context);
//   }
// };

const getDistanceTime = async (req, res, next) => {
  let context = {
    success: 1,
    message: "Distance and Time retrieved successfully",
    data: {},
    status: 200,
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { origin, destination } = req.query;

    const distanceTime = await mapService.getDistanceTime(origin, destination);
    context.data = distanceTime;
    console.log("Distance and Time retrieved successfully:", context.data);
    // context = response(context);

    next();
  } catch (error) {
    context.success = 0;
    context.message = error.message || error.toString();
    // context = response(context);
    res.status(context.status).json(context);
  }
  res.status(200).send(context);
};

const getAutoComplete = async (req, res, next) => {
  let context = {
    success: 1,
    message: "AutoComplete retrieved successfully",
    data: {},
    status: 200,
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  try {
    const { input } = req.query;
    const autoComplete = await mapService.getAutoCompleteSuggestions(input);
    context.data = autoComplete;
    console.log("AutoComplete retrieved successfully:", context.data);
    // context = response(context);

    next();
  } catch (error) {
    context.success = 0;
    context.message = error.message || error.toString();
    context = response(context);
    res.status(context.status).json(context);
  }
  res.status(200).send(context);
};

module.exports = {
  getCoordinates,
  getDistanceTime,
  getAutoComplete,
};
