const mongoose = require("mongoose");
const { userSchema, postSchema } = require("../utils/schema");
const Post = require("../models/post");
const UserProfile = require("../models/UserProfile");
const Comment = require("../models/Comment");

/**
 * Check if a user already exists
 */
// module.exports.userExists = (user) => {
//     return this.findOne({ username: user.username }).exec();
// }

// handle cascade delete of child models e.g Post and Comment
userSchema.pre("findOneAndDelete", async function () {
  const user = await this.model.findOne(this.getFilter());

  try {
    // Delete all associated posts
    await Post.deleteMany({ createdBy: user._id.toString() });

    // Delete all associated comments
    await Comment.deleteMany({ commentedBy: user._id.toString() });

    // Delete associated user profile
    await UserProfile.deleteOne({ userId: user._id.toString() });
  } catch (error) {
    console.error("Error deleting associated comments and likes:", error);
  }
});

module.exports = mongoose.model("users", userSchema);
