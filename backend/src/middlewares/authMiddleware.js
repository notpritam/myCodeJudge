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

    console.log(user, "this is verified user log");

    req.user = user;
    next();
  });
};

export { authenticateJWT };
