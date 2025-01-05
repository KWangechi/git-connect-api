const mongoose = require("mongoose");
// const { validate } = require("../models/UserProfile");

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
    },
    emailAddress: {
      type: String,
      required: true,
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
    },
    // profilePhoto: {
    //   type: Object,
    //   required: false,
    // },
    photoUrl: {
      type: String,
      required: true,
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
    socialLinks: [
      {
        platform: {
          type: String,
          required: true,
          validate: {
            validator: function (platform) {
              return ["twitter", "website", "github"].includes(platform);
            },
            message: (props) => `${props.value} is not a valid platform.`,
          },
        },
        url: {
          type: String,
          required: true,
          validate: {
            validator: function (url) {
              if (this.platform) {
                switch (this.platform) {
                  case "twitter":
                    return /^https:\/\/(www\.)?x\.com\/\w+$/i.test(url);
                  case "website":
                    return /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/i.test(
                      url
                    );
                  case "github":
                    return /^https:\/\/(www\.)?github\.com\/\w+$/i.test(url);
                  default:
                    return false;
                }
              }
              return false;
            },
            message: (props) =>
              `${props.value} is not a valid URL for the specified platform.`,
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = { userSchema, userProfileSchema };
