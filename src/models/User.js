const mongoose = require("mongoose");
const { userSchema } = require("../utils/schema");

/**
 * Check if a user already exists
 */
// module.exports.userExists = (user) => {
//     return this.findOne({ username: user.username }).exec();
// }


module.exports = mongoose.model("users", userSchema);
