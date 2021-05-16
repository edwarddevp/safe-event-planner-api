const jwt = require("jsonwebtoken");
//middleware

// format of token
// Authorization: Bearer <access_token>

// verify token
function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers["authorization"];
  
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    jwt.verify(req.token, "secretkey", (err, session) => {
      if (err) {
        res.status(401).json({
          success: false,
          code: 401,
          data: {},
          message: "PermissionError",
          errors: {
            error: ["Unauthorized: invalid token."],
          },
        });
      } else {
        req.session = session;
        next();
      }
    });
  } else {
    // Forbidden
    res.status(403).json({
      success: false,
      code: 403,
      data: {},
      message: "PermissionError",
      errors: {
        error: [
          "Authentication credentials were not provided - Token is required",
        ],
      },
    });
  }
}

module.exports = {
  verifyToken: verifyToken,
};
