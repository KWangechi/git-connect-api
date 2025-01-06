const mongoose = require("mongoose");
const { likePostSchema } = require("../utils/schema");

module.exports = mongoose.model("LikePost", likePostSchema);
