import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/jwt";

const authenticateJWT = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["Authorization"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  verifyToken(token, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded.user;
    next();
  });
};

export { authenticateJWT };
