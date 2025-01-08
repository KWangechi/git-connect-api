const express = require("express");
const asyncHandler = require("../../middlewares/asyncHandler");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../../utils/generateTokens");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

const registerUser = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    username,
    emailAddress,
    password,
    confirmPassword,
  } = req.body;

  // const { error, value } = userSchema.validate({ emailAddress, password });
  const userEmail = await User.findOne({ emailAddress });
  const userName = await User.findOne({ username });

  if (userEmail || userName) {
    return next(
      res.status(409).json({
        status: {
          code: 409,
          message: userEmail
            ? "Email address already exists"
            : userName
            ? "Username already taken"
            : "",
        },
      })
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  if (confirmPassword !== password) {
    return next(
      res.status(400).json({
        status: {
          code: 400,
          message: "Passwords do not match!",
        },
      })
    );
  }

  const user = new User({
    firstName,
    lastName,
    username,
    emailAddress,
    password: passwordHash,
  });

  const savedUser = await user.save();

  if (!savedUser) {
    return next(
      res.status(400).json({
        status: {
          code: 400,
          message: "Failed to register user",
        },
        data: savedUser,
      })
    );
  }

  res.status(201).json({
    status: {
      code: 201,
      message: "User registered successfully",
    },
    data: savedUser,
  });
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { emailAddress, password } = req.body;

  // validate the inputs
  // const { error, value } = userSchema.validate({ emailAddress, password });
  // console.log(error);

  const user = await User.findOne({ emailAddress });

  if (!user) {
    return next(
      res.json({
        status: {
          code: 401,
          message: "Invalid email or password",
        },
      })
    );
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return next(
      res.json({
        status: {
          code: 401,
          message: "Invalid email or password",
        },
      })
    );
  }

  // generate a token and check if they match
  const accessToken = createAccessToken(user);

  res.status(200).json({
    status: {
      code: 200,
      message: "User Logged In Successfully",
    },
    data: {
      user,
      accessToken,
    },
  });
});

const logout = asyncHandler(async (req, res, next) => {
  // TODO: Implement logout logic here
  // e.g., delete the access token from the database or invalidate it
  // and send a response to the client indicating that they've been logged out
  const accessToken = req.headers.authorization.split("")[1];

  console.log("User logged out successfully");

  // Send a response to the client indicating that they've been logged out

  // res.status(200).json({
  //   status: {
  //     code: 200,
  //     message: "User Logged Out Successfully",
  //   },
  // });
  res.status(200).json({
    status: {
      code: 200,
      message: "User Logged Out Successfully",
    },
  });
});

module.exports = { registerUser, loginUser, logout };
