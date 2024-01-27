import fs from "fs";
import { spawn } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { text } from "express";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const handleJavaCode = (req, res, userCode, testCases) => {
  const fileName = "Main.java";
  const filePath = `${__dirname}/${fileName}`;
  fs.writeFileSync(filePath, userCode, "utf-8");

  const compileCommand = `docker run --rm -v ${__dirname}:/code coderunner_java javac ${fileName}`;

  if (compileCommand) {
    const compileProcess = spawn(compileCommand, {
      shell: true,
    });
    compileProcess.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    compileProcess.stderr.on("data", (stderr) => {
      console.error(`Compilation error: ${stderr}`);
      res.status(500).json({ compileError: `${stderr}` });
    });

    compileProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Compilation successful of Java");
        runCode();
      } else {
        console.error(`Compilation failed with code ${code}`);
      }
    });
  }

  function runCode() {
    const customInput = testCases.input.replace("\r", ""); // Customize this input
    const inputFilePath = "input.txt";
    const expectedOutput = testCases.expectedOutput.replace("\r", "");

    fs.writeFileSync(inputFilePath, customInput, "utf-8");

    const dockerContainer = spawn(
      "docker",
      [
        "run",
        "--rm",
        "-i",
        "-v",
        `${__dirname}:/code`,
        "coderunner_java",
        "java",
        "Main",
      ],
      {
        stdio: ["pipe", "pipe", "pipe"],
      }
    );

    const inputStream = fs.createReadStream(inputFilePath);
    inputStream.pipe(dockerContainer.stdin);

    var outputValue = "";

    dockerContainer.stdout.on("data", (data) => {
      const output = data.toString();
      //   console.log(`Output: \n${output}`);
      outputValue += output;
      // fs.writeFileSync(outputFilePath, output, "utf-8");

      // console.log("Output written to output.txt");
    });

    dockerContainer.stderr.on("data", (stderr) => {
      console.error(`Docker container stderr: ${stderr}`);
    });

    dockerContainer.on("close", (code) => {
      console.log(`Output: \n${outputValue}`);
      console.log(`Docker container closed with code ${code}`);

      if (expectedOutput === outputValue) {
        res.status(200).json({ message: "All Test Cases Passed" });
      } else {
        res.status(200).json({ message: "Test Cases Failed" });
      }
    });
  }
};