const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      // select: false,
    },
  },
  {
    timestamps: true,
  }
);

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    photoUrl: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    location: String,
    // skills: [String],
    education: {
      degree: String,
      major: String,
      graduationYear: Number,
      stillInSchool: {
        type: Boolean,
        default: false,
      },
      institution: String,
      location: String,
    },

    workExperience: [
      {
        jobTitle: String,
        company: String,
        startDate: Date,
        endDate: Date,
        stillWorkingHere: {
          type: Boolean,
          default: false,
        },
        location: String,
      },
    ],
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    twitterLink: {
      type: String,
      required: false,
    },
    githubLink: {
      type: String,
      required: false,
    },
    websiteLink: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = { userSchema, userProfileSchema };
