const express = require("express");
const process = require("process");
const asyncHandler = require("../middlewares/asyncHandler");
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
  const users = await User.find();

  return next(
    res.json({
      status: {
        message: "Success",
        code: 200,
      },
      data: users,
    })
  );
});

const search = asyncHandler(async (req, res, next) => {
  const { searchTerm } = req.query;

  // an array of fields in the user that can be searched
  // const searchFields = [
  //   "username",
  //   /^Name/,
  //   /profile.(*)/,
  //   // /profile\.education\.institution/,
  // ];

  // // search for the searchTerm in any of the searchFields
  // const users = await User.find({
  //   $or: searchFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: "i" },
  //   })),
  // });

  const searchFields = [
    "username",
    "firstName", // Changed regex to field name
    "profile.occupation", // Example of a specific nested field
    "profile.education.institution", // Nested field
  ];

  // Use $or to search for the `searchTerm` in all `searchFields`
  const users = await User.find({
    $or: searchFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: "i" },
    })),
  });

  if (!users.length) {
    return next(
      res.status(404).json({
        code: 404,
        message: "No Users Found",
      })
    );
  }

  return next(
    res.json({
      status: {
        message: "Users Found",
        code: 200,
      },
      data: users,
    })
  );
});

const show = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ username: req.params?.username });

  if (!user) {
    return next(
      res.status(404).json({
        code: 404,
        message: "User Not Found",
      })
    );
  }

  res.status(200).json({
    status: {
      message: "User Profile Found!",
      code: 200,
    },
    data: user,
  });
});

/**
 * Create a user profile for the logged in user and also allow updates
 */
const update = asyncHandler(async (req, res, next) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: "User Not Found",
      });
    }

    if (req.userId !== user._id.toString())
      return next(
        res.json({
          status: {
            message: "Action not allowed on this username!",
            code: 500,
          },
        })
      );

    // Handle file upload
    let photoUrl,
      rootPath = process.cwd();

    try {
      photoUrl = await upload(req);
      if (!photoUrl) {
        return res.json({
          message: "Failed to upload photo",
          code: 400,
        });
      }
    } catch (error) {
      return res.json({
        status: {
          message: "Error occurred while uploading the photo",
          code: 500,
        },
        data: error.message,
      });
    }
    const absoluteProfilePhotoUrl = path.join(rootPath, photoUrl);

    const updatedProfileData = {
      ...req.body,
      workExperience: JSON.parse(req.body.workExperience),
      socialLinks: JSON.parse(req.body.socialLinks),
      photoUrl: absoluteProfilePhotoUrl || user.profile?.photoUrl,
    };

    // Update user's profile in the database
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { profile: updatedProfileData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.json({
        code: 500,
        message: "Failed to update user profile",
      });
    }

    // Respond with the updated user profile
    res.json({
      status: {
        message: "User profile updated successfully!",
        code: 200,
      },
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return next(
      res.json({
        status: {
          message: "An error occurred while updating the user profile",
          code: 500,
        },
        data: error.message,
      })
    );
  }
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

  if (req.userId !== user._id.toString())
    return next(
      res.status(500).json({
        status: {
          message: "Action not allowed on this username!",
          code: 500,
        },
      })
    );

  try {
    const userProfile = await User.findOneAndUpdate(
      { _id: user._id },
      { profile: null },
      { new: true }
    );

    if (!userProfile) {
      return next(res.json({ message: "Error Occurred!", code: 404 }));
    }
    res.json({ message: "User profile deleted successfully!", code: 200 });
  } catch (error) {
    return next(
      res.json({
        status: {
          message: "An error occurred while deleting the user profile",
          code: 500,
        },
        data: error.message,
      })
    );
  }
});

module.exports = { index, show, destroy, update, search };
