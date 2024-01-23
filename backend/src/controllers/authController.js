import User from "../models/User.js";
import { signToken, verifyToken } from "../utils/jwt.js";
import axios from "axios";
const login = (req, res) => {};

const callback = async (req, res) => {
  const googleRes = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${req.body.token}`,
      },
      params: {
        personFileds: "emailAddresses,names,photos",
      },
    }
  );

  if (!googleRes.data.email) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = signToken(googleRes.data);

  const user = await User.findOne({ googleId: googleRes.data.sub });

  if (!user) {
    await User.create({
      googleId: googleRes.data.sub,
      email: googleRes.data.email,
      name: googleRes.data.name,
      avatar: googleRes.data.picture,
    });
  }

  res.status(200).json({ message: "Data", user: googleRes.data, token: token });
};

const logout = (req, res) => {
  res.status(200).json({ message: "Logout Successfull" });
};

export { logout, callback };
