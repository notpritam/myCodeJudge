import CodeSnippet from "../models/QuestionModels/CodeSnippet.js";
import TestCases from "../models/QuestionModels/TestCases.js";

export const submitCode = (req, res) => {
  console.log(req.body);
  res.send("Submit Code False");
};

export const addQuestion = async (req, res) => {
  console.log(req.body);
  try {
    // Create instances of CodeSnippet and TestCases using the request body
    const codeSnippets = req.body.codeSnippets.map(
      (snippet) => new CodeSnippet(snippet)
    );
    const testCases = req.body.testCases.map(
      (testCase) => new TestCases(testCase)
    );

    // Create a new question instance using the request body, including CodeSnippet and TestCases
    const newQuestion = new Question({
      ...req.body,
      codeSnippets,
      testCases,
    });

    // Save the question to the database
    const savedQuestion = await newQuestion.save();

    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
