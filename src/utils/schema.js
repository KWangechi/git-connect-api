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
      min: [6, "Password should be minimum 6 characters"],
      validator: function () {
        const passwordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(this.password);
      },
      // select: false,
    },
  },
  {
    timestamps: true,
  }
);

const userProfileSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    occupation: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
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


const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is Required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    liked: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    commentedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const likePostSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    likedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const tokenBlacklistSchema = new mongoose.Schema(
  {
    accessToken: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = {
  userSchema,
  userProfileSchema,
  tokenBlacklistSchema,
  likePostSchema,
  postSchema,
  commentSchema,
};
