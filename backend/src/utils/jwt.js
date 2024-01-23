import jwt from "jsonwebtoken";

const signToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const verifyToken = (token, callback) => {
  jwt.verify(token, process.env.JWT_SECRET, callback);
};

export { signToken, verifyToken };
