const mongoose = require("mongoose");
const { postSchema } = require("../utils/schema");

module.exports = mongoose.model("Post", postSchema);
