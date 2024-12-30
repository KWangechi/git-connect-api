const mongoose = require("mongoose");
const { tokenBlacklistSchema } = require("../utils/schema");

module.exports = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
