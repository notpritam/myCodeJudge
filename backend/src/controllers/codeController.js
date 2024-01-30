import {
  handleCPPCode,
  handleJavaCode,
  handlePythonCode,
} from "../services/codeServices.js";

export const submitCode = (req, res) => {
  console.log(req.params.slug);

  const language = req.body.language;
  const code = req.body.code;
  const testCases = req.body.questionDetails.testCases;

  console.log(language, code, testCases);

  if (language.toLowerCase() === "java") {
    handleJavaCode(req, res, code, testCases);
  } else if (language.toLowerCase() === "python") {
    handlePythonCode(req, res, code, testCases);
  } else if (language.toLowerCase() === "javascript") {
    res.status(200).json({
      message: "Javascript not supported at the moment",
      outputValue: "",
      error: true,
      success: false,
      input: "",
      expectedOutput: "",
    });
  } else if (language.toLowerCase() === "cpp") {
    handleCPPCode(req, res, code, testCases);
  }
};
