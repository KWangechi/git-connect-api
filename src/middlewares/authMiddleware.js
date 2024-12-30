// should protect the user profile and post routes - auth middleware
const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/TokenBlacklist");

const verifyToken = async (req, res, next) => {
  let accessToken;

  const authHeader = req.header("Authorization") || req.header("authorization");

  if (!authHeader?.includes("Bearer")) {
    return next(
      res.status(401).json({
        message: "Unauthorized Access",
        code: 401,
      })
    );
  }
  accessToken = authHeader.toString().split(" ")[1];

  // check that this token is not in the blacklisted collection
  const isTokenBlacklisted = await TokenBlacklist.findOne({
    accessToken,
  });

  if (isTokenBlacklisted) {
    return next(
      res.status(401).json({
        message: "Session Expired! Please Login",
        code: 401,
      })
    );
  }

  // verify the token now
  jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN,
    async (error, decoded) => {
      if (error)
        return next(
          res.status(403).json({
            message: "Invalid Token",
            code: 403,
          })
        );

      req.userId = decoded.UserInfo.userId;
      req.userEmail = decoded.UserInfo.userEmail;

      next();
    }
  );
};

module.exports = verifyToken;
