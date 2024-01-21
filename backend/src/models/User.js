import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  profileImageURL: {
    type: String,
  },
});

const User = mongoose.model.User || mongoose.model("User", userSchema);
export default User;
