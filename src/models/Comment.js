const mongoose = require("mongoose");
const { commentSchema } = require("../utils/schema");

module.exports = mongoose.model("Comment", commentSchema);
