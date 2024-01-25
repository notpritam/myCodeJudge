import mongoose from "mongoose";

const testCases = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
});

const TestCases =
  mongoose.model.TestCases || mongoose.model("TestCases", testCases);

export default TestCases;
