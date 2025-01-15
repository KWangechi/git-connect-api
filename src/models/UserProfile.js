const mongoose = require("mongoose");
const { userProfileSchema } = require("../utils/schema");

module.exports = mongoose.model("UserProfile", userProfileSchema);

