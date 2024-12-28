const express = require("express");
const asyncHandler = require("../middlewares/asyncHandler");
const UserProfile = require("../models/UserProfile");

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// CRUD routes

/**
 * Get the Profile of a Developer
 */
const index = asyncHandler(async (req, res, next) => {
  console.log(req.username);
  const userProfile = await UserProfile.findOne()
    .where("username")
    .equals(req.username);

    

  if (!userProfile)
    return next(
      res.status(404).json({ message: "User Profile not found", code: 404 })
    );

  console.log(userProfile);

  res.json(userProfile);
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
    twitterLink: req.body.twitterLink,
    websiteLink: req.body.websiteLink,
    githubLink: req.body.githubLink,
  });

  console.log(userProfile);

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

// UPDATE

const update = asyncHandler(async (req, res, next) => {
  const userProfile = await UserProfile.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!userProfile) return res.status(404).json({ message: "User not found" });

  res.status(200).json({
    status: {
      message: "User profile updated successfully!",
      code: 200,
    },
    data: userProfile,
  });

  // send email or notification to the user about the updated profile
  // sendEmail(userProfile.emailAddress, "Developer Profile Updated", `Your profile has been updated.`);
});

// DELETE
const destroy = asyncHandler(async (req, res, next) => {
  const userProfile = await UserProfile.findByIdAndDelete(req.params.id);

  if (!userProfile) return res.status(404).json({ message: "User not found" });

  res
    .status(204)
    .json({ message: "User profile deleted successfully!", code: 204 });

  // send email or notification to the user about the deleted profile
  // sendEmail(userProfile.emailAddress, "Developer Profile Deleted", `Your profile has been deleted.`);
});

module.exports = { index, store, update, destroy };
