const jwt = require("jsonwebtoken");

  const checkToken = async (req, res, next) => {
    try {
      const [, token] = req.headers.authorization.split(" ");
      const jwtSecret = process.env.JWT_SECRET;
      const decodedToken = jwt.verify(token, jwtSecret);
      req.payload = decodedToken;
      next();
    } catch (e) {
      console.log(e);
      res.status(403).json({ message: "Unauthorized" });
    }
  };

module.exports = {
    checkToken,
};
