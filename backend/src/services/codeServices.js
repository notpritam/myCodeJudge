import fs from "fs";
import { spawn } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";
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

    var compliationError = [];

    compileProcess.stderr.on("data", (stderr) => {
      console.error(`Compilation error: ${stderr}`);
      compliationError.push(stderr);
    });

    compileProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Compilation successful of Java");
        runCode();
      } else {
        console.error(`Compilation failed with code ${code}`);
        res.status(200).json({
          message: "Compilation Error : " + compliationError.toString(),
          error: true,
          success: false,
          outputValue: "outputValue",
          input: "",
          expectedOutput: "",
        });
      }
    });
  }

  function runCode() {
    const customInput = testCases.input.replace("\r", "");
    const inputFilePath = "input.txt";
    const expectedOutput = testCases.expectedOutput.replace("\r", "");
    const outputFileList = expectedOutput.split("\n");
    const inputList = customInput.split("\n");

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
      console.log(`Expected Output: \n${expectedOutput}`);
      console.log(`Output: \n${outputValue}`);
      console.log(`Docker container closed with code ${code}`);

      const outputList = outputValue.split("");

      if (expectedOutput.trim() === outputValue.trim()) {
        res.status(200).json({
          message: "All Test Cases Passed",
          outputValue: outputValue,
          error: false,
          success: true,
          input: customInput,
          expectedOutput: expectedOutput,
        });
      } else {
        res.status(200).json({
          message: "Test Cases Failed",
          error: true,
          success: false,
          outputValue: outputValue,
          input: customInput,
          expectedOutput: expectedOutput,
        });
      }
    });
  }
};

export const handleCPPCode = (req, res, userCode, testCases) => {
  const fileName = "main.cpp";
  const filePath = `${__dirname}/${fileName}`;
  fs.writeFileSync(filePath, userCode, "utf-8");

  const compileCommand = `docker run --rm -v ${__dirname}:/code coderunner_cpp g++ ${fileName} -o main`;

  const compileProcess = spawn(compileCommand, {
    shell: true,
  });

  compileProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  var compilationError = [];

  compileProcess.stderr.on("data", (stderr) => {
    console.error(`Compilation error: ${stderr}`);
    compilationError.push(stderr);
  });

  compileProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Compilation successful of C++");
      runCode();
    } else {
      console.error(`Compilation failed with code ${code}`);
      res.status(200).json({
        message: "Compilation Error : " + compilationError.toString(),
        error: true,
        success: false,
        outputValue: "outputValue",
        input: "",
        expectedOutput: "",
      });
    }
  });

  function runCode() {
    const customInput = testCases.input.replace("\r", "");
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
        "coderunner_cpp",
        "./main",
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
      outputValue += output;
    });

    dockerContainer.stderr.on("data", (stderr) => {
      console.error(`Docker container stderr: ${stderr}`);
    });

    dockerContainer.on("close", (code) => {
      console.log(`Expected Output: \n${expectedOutput}`);
      console.log(`Output: \n${outputValue}`);
      console.log(`Docker container closed with code ${code}`);

      if (expectedOutput.trim() === outputValue.trim()) {
        res.status(200).json({
          message: "All Test Cases Passed",
          outputValue: outputValue,
          error: false,
          success: true,
          input: customInput,
          expectedOutput: expectedOutput,
        });
      } else {
        res.status(200).json({
          message: "Test Cases Failed",
          error: true,
          success: false,
          outputValue: outputValue,
          input: customInput,
          expectedOutput: expectedOutput,
        });
      }
    });
  }
};

export const handlePythonCode = (req, res, userCode, testCases) => {
  const fileName = "main.py";
  const filePath = `${__dirname}/${fileName}`;
  fs.writeFileSync(filePath, userCode, "utf-8");

  const customInput = testCases.input.replace("\r", "");
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
      "coderunner_python",
      "python3",
      `main.py`,
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
    outputValue += output;
  });

  dockerContainer.stderr.on("data", (stderr) => {
    console.error(`Docker container stderr: ${stderr}`);
  });

  dockerContainer.on("close", (code) => {
    console.log(`Expected Output: \n${expectedOutput}`);
    console.log(`Output: \n${outputValue}`);
    console.log(`Docker container closed with code ${code}`);

    if (expectedOutput.trim() === outputValue.trim()) {
      res.status(200).json({
        message: "All Test Cases Passed",
        outputValue: outputValue,
        error: false,
        success: true,
        input: customInput,
        expectedOutput: expectedOutput,
      });
    } else {
      res.status(200).json({
        message: "Test Cases Failed",
        error: true,
        success: false,
        outputValue: outputValue,
        input: customInput,
        expectedOutput: expectedOutput,
      });
    }
  });
};
