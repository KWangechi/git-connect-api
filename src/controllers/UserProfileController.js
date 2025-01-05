const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const UserProfile = require("../models/UserProfile");
const User = require("../models/User");
const { upload } = require("../utils/uploadPhotos");
const path = require("path");

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
      res.status(404).json({
        code: 404,
        message: "User Not Found",
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
  // check if the user exists first
  const user = await User.findOne({ username: req.params.username });
  if (!user) {
    return res.status(404).json({
      code: 404,
      message: "User Not Found",
    });
  }

  // handle when a file is uploaded
  let photoUrl;
  try {
    photoUrl = await upload(req);
    if (!photoUrl) {
      return res.status(400).json({
        message: error || "Failed to upload photo",
        code: 400,
      });
    }

    // Process the text data of the form
    // current path of the folder project
    const absoluteProfilePhotoUrl = path.join(__dirname, photoUrl);

    // sanitize and validate the user profile data
    const userProfile = new UserProfile({
      userId: req.userId,
      workExperience: JSON.parse(req.body.workExperience),
      occupation: req.body.occupation,
      phoneNumber: req.body.phoneNumber,
      yearsOfExperience: req.body.yearsOfExperience,
      photoUrl: absoluteProfilePhotoUrl,
      dateOfBirth: req.body.dateOfBirth,
      location: req.body.location,
      education: JSON.parse(req.body.education),
      socialLinks: JSON.parse(req.body.socialLinks),
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
  } catch (error) {
    return next(
      res.status(500).json({
        status: {
          message: "Error occurred while processing post",
          code: 500,
        },
        data: error.message,
      })
    );
  }

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
        message: "User not found",
        code: 404,
      })
    );

  // check if an image is being uploaded
  const updatedUserProfile = {
    ...req.body,
  };

  const userProfile = await UserProfile.findOneAndUpdate(
    { userId: user._id },
    req.body,
    { new: false }
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
        message: "User not found",
        code: 404,
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
