import { signToken, verifyToken } from "../utils/jwt.js";
import passport from "passport";

const login = (req, res) => {
  const user = req.user;

  // what we are passing as first argument to jwt.sign() will be available as decoded in authMiddleware.js where i am decoding the token
  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, { httpOnly: true });

  res.status(200).json({ message: "Login" });
};

const logout = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({ message: "Logout Successfull" });
};

const register = (req, res) => {
  res.status(200).json({ message: "Register" });
};

export { login, register };
