import mongoose from "mongoose";

const solutionSchema = new mongoose.Schema({
  lang: {
    type: String,
    required: true,
  },
  langSlug: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const Solution =
  mongoose.model.Solution || mongoose.model("Solution", solutionSchema);

export default Solution;
