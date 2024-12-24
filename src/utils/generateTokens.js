require("dotenv").config();

const jwt = require("jsonwebtoken");
const accessTokenExpiration = process.env.JWT_ACCESS_TOKEN_EXPIRATION || "5d";

module.exports.createAccessToken = (userInfo) => {
  const accessToken = jwt.sign(
    {
      UserInfo: {
        userEmail: userInfo.emailAddress,
        userId: userInfo._id,
      },
    },
    process.env.JWT_ACCESS_TOKEN,
    { expiresIn: accessTokenExpiration }
  );

  return accessToken;
};
