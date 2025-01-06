const mongoose = require("mongoose");
const { postSchema } = require("../utils/schema");
const Comment = require("./Comment");

// send an error if the user being referenced in the post routes doesn't exist anymore

postSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getFilter());

  try {
    await Comment.deleteMany({ postId: doc._id.toString() });
    // await this.model("Like").deleteMany({ post: doc._id });
  } catch (error) {
    console.error("Error deleting associated comments and likes:", error);
  }
});

// handle delete cascades for child models e.g Schema
// postSchema.pre("remove", async function (next) {
//   try {
//     await this.model("Comment").deleteMany({ postId: this._id });
//     // await this.model("Like").deleteMany({ post: this._id });
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = mongoose.model("Post", postSchema);
