import jwt from "jsonwebtoken";

const authenticateJWT = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["Authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded.user;
  });
};

export { authenticateJWT };
