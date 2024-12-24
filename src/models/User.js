const mongoose = require("mongoose");
const { userSchema } = require("../utils/schema");


module.exports = mongoose.model("users", userSchema);
