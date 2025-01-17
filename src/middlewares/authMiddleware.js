// should protect the user profile and post routes - auth middleware
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
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

  // verify the token now
  jwt.verify(
    accessToken,
    process.env.JWT_ACCESS_TOKEN,
    async (error, decoded) => {
      if (error)
        return next(
          res.status(401).json({
            message: "Unauthorized Access",
            code: 401,
          })
        );

      req.userId = decoded.UserInfo.userId;
      req.userEmail = decoded.UserInfo.userEmail;

      next();
    }
  );
};

module.exports = verifyToken;
