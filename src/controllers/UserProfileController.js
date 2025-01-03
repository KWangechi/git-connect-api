const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const UserProfile = require("../models/UserProfile");
const User = require("../models/User");
const user = require("../models/User");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// CRUD routes

/**
 * Get the Profile of a Developer
 */
const index = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.params?.username });

  if (!user) {
    return next(
      res.status(401).json({
        status: {
          code: 401,
          message: "Username Not Found",
        },
      })
    );
  }

  const userId = user._id;

  const userProfile = await UserProfile.findOne()
    .where("userId")
    .equals(userId);

  if (!userProfile)
    return next(
      res.status(404).json({ message: "User Profile not found", code: 404 })
    );

  res.status(200).json({
    status: {
      message: "User Profile Found!",
      code: 200,
    },
    data: userProfile,
  });
});

/**
 * Create a user profile for the logged in user
 */
const store = asyncHandler(async (req, res, next) => {
  // create a profile for the currently logged in user
  const userProfile = new UserProfile({
    userId: req.userId,
    workExperience: req.body.workExperience,
    occupation: req.body.occupation,
    phoneNumber: req.body.phoneNumber,
    yearsOfExperience: req.body.yearsOfExperience,
    photoUrl: req.body.photoUrl,
    dateOfBirth: req.body.dateOfBirth,
    location: req.body.location,
    education: req.body.education,
    socialLinks: req.body.socialLinks,
  });

  const validationError = userProfile.validateSync();

  if (validationError) {
    let errors = [];

    console.log(validationError.errors);

    for (const field in validationError.errors) {
      errors.push({
        field: field,
        message: validationError.errors[field].message,
      });
    }
    return res.status(400).json({
      status: {
        message: "Invalid user profile data",
        code: 400,
      },
      data: errors,
    });
  }

  const savedUserProfile = await userProfile.save();
  if (!savedUserProfile)
    return next(
      res.json({
        status: {
          message: "Error occurred!",
          code: 500,
        },
      })
    );

  res.status(201).json({
    status: {
      message: "User profile created successfully!",
      code: 201,
    },
    data: savedUserProfile,
  });

  // send email or notification to the user about the new profile
  // sendEmail(userProfile.emailAddress, "New Developer Profile", `Your profile has been created.`);
});

/**
 * Update details of the logged in user only
 */

const update = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.params?.username });

  if (!user)
    return next(
      res.status(404).json({
        status: {
          message: "Username not found",
          code: 404,
        },
      })
    );

  const userProfile = await UserProfile.findOneAndUpdate(
    { userId: user._id },
    req.body,
    { new: true }
  );

  if (!userProfile)
    return next(res.status(404).json({ message: "User Profile not found" }));

  if (req.userId !== user._id.toString())
    return next(
      res.status(500).json({
        status: {
          message: "Action not allowed on this username!",
          code: 500,
        },
      })
    );

  res.status(200).json({
    status: {
      message: "User profile updated successfully!",
      code: 200,
    },
    data: userProfile,
  });
});

/**
 * Delete a user profile
 */
const destroy = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.params?.username });

  if (!user)
    return next(
      res.status(404).json({
        status: {
          message: "Username not found",
          code: 404,
        },
      })
    );

  const userProfile = await UserProfile.findOneAndDelete({ userId: user._id });

  if (!userProfile)
    return next(
      res.status(404).json({ message: "User Profile not found", code: 404 })
    );

  if (req.userId !== user._id.toString())
    return next(
      res.status(500).json({
        status: {
          message: "Action not allowed on this username!",
          code: 500,
        },
      })
    );

  res
    .status(200)
    .json({ message: "User profile deleted successfully!", code: 200 });

  // send email or notification to the user about the deleted profile
  // sendEmail(userProfile.emailAddress, "Developer Profile Deleted", `Your profile has been deleted.`);
});

module.exports = { index, store, update, destroy };
