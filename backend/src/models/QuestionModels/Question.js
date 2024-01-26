import mongoose from "mongoose";
import CodeSnippet from "./CodeSnippet.js";
import TestCases from "./TestCases.js";

const questionSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    enum: ["easy", "medium", "hard"],
  },
  topic: {
    type: [String],
    required: true,
  },
  companies: {
    type: [String],
  },
  title: {
    type: String,
    required: true,
  },
  "title-slug": {
    type: String,
    required: true,
    unique: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },

  content: {
    type: String,
    required: true,
  },
  codeSnippets: {
    type: [CodeSnippet.schema],
    required: true,
  },
  testCases: {
    type: [TestCases.schema],
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);
export default Question;
