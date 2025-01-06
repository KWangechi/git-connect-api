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

// send an error if the user being referenced in the post routes doesn't exist anymore
// postSchema.post("findOneAndUpdate", async function (doc) {
//   if (!doc) return;

//   try {
//     await this.model("Comment").deleteMany({ postId: doc._id });
//   } catch (error) {
//     console.error("Error deleting associated posts and comments", error);
//   }
// });

// postSchema.pre("save", async function (doc) {
//   if (!doc) return;

//   try {
//     await this.model("Comment").deleteMany({ postId: doc._id });
//     await this.model("Post").deleteMany({ createdBy: doc._id });
//     await this.model("UserProfile").deleteOne({ userId: doc._id });
//   } catch (error) {
//     console.error(
//       "Error deleting associated posts, user profiles and comments",
//       error
//     );
//   }
// });

// handle cascade delete of child models e.g Post and Comment
userSchema.pre("findOneAndDelete", async function (next) {
  const user = this;

  // Delete all associated posts
  await Post.deleteMany({ createdBy: user._id });

  // Delete all associated comments
  await Comment.deleteMany({ commentedBy: user._id });

  // Delete associated user profile
  await UserProfile.deleteOne({ userId: user._id });

  next();
});

module.exports = mongoose.model("users", userSchema);
