const userSchema = require("../schemas/userSchema");
const _ = require("underscore");

const createUser = async ({ fullname, email, password }) => {
  if (!fullname || !email || !password) {
    throw new Error("All fields are required");
  }
  // // Check if the user already exists
  // const existingUser = await userSchema.findOne({ email });
  // if (existingUser) {
  //   throw new Error("User already registered");
  // }
  const user = await userSchema.create({ fullname, email, password });
  return user;
};

const getUser = async (reqUser) => {
  const context = {
    success: 1,
    message: "User fetched successfully",
    data: {},
  };

  try {
    let user = await userSchema
      .findOne({
        email: reqUser["email"],
      })
      .select("_id email fullname orders role last_login first_time_login");
    if (user) {
      user.last_login = new Date();
      user.first_time_login = false;
      user.save();
    }
    // console.log("Searching for user with email:", reqUser.email);
    context.data = user;
    console.log("User fetched successfully:", context.data);
  } catch (error) {
    context.success = 0;
    context.message = error.message || error.toString();
  }

  return context;
};

module.exports = {
  createUser,
  getUser,
};
