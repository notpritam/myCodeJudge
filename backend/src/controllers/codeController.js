import { handleJavaCode } from "../services/codeServices.js";

export const submitCode = (req, res) => {
  console.log(req.params.slug);

  const language = req.body.language;
  const code = req.body.code;
  const testCases = req.body.questionDetails.testCases;

  console.log(language, code, testCases);

  if (language.toLowerCase() === "java") {
    handleJavaCode(req, res, code, testCases);
  } else {
    res.send("Not Java");
  }
};
