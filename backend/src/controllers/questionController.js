import CodeSnippet from "../models/QuestionModels/CodeSnippet.js";
import Question from "../models/QuestionModels/Question.js";
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
    const testCases = new TestCases(req.body.testCases);
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
    res.status(500).json({ error: `${error}` });
  }
};

export const getQuestion = async (req, res) => {
  try {
    console.log(req.params.slug);
    const question = await Question.findOne({ "title-slug": req.params.slug });
    console.log(question);

    if (!question) {
      res.status(404).json({ error: "Question not found" });
    } else {
      res.status(200).json(question);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `${error}` });
  }
};
