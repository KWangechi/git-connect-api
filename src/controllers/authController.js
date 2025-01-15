const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../utils/generateTokens");
const TokenBlacklist = require("../models/TokenBlacklist");

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

  // const { errors, value } = user.validateSync({ emailAddress, password });
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

  // generate a token
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
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) return next(res.status(204));

  const accessToken = authHeader.split(" ")[1];

  const isTokenBlacklisted = await TokenBlacklist.findOne({ accessToken });

  if (isTokenBlacklisted) {
    return next(res.status(204));
  }

  // Add token to blacklisted collection
  const newBlacklistedToken = new TokenBlacklist({ accessToken });
  await newBlacklistedToken.save();

  // Remove this token and also clear the authorization header
  res.setHeader("Authorization", null);
  res.setHeader("Access-Control-Allow-Credentials", "false");

  res.status(200).json({
    status: {
      code: 200,
      message: "User Logged Out Successfully",
    },
  });
});

module.exports = { registerUser, loginUser, logout };
