import { verifyToken } from "../utils/jwt.js";

const authenticateJWT = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  verifyToken(token, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log(user, "this is verified user log");

    req.user = user;
    next();
  });
};

export { authenticateJWT };
