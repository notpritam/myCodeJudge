import fs from "fs";
import { spawn } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userCode = `
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
`;

const fileName = "main.cpp";
fs.writeFileSync(fileName, userCode, "utf-8");

const compileCommand = `docker run --rm -v ${__dirname}:/code coderunner_cpp g++ -o main ${fileName}`;

if (compileCommand) {
  const compileProcess = spawn(compileCommand, {
    shell: true,
  });
  compileProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  compileProcess.stderr.on("data", (stderr) => {
    console.error(`Compilation error: ${stderr}`);
  });

  compileProcess.on("close", (code) => {
    if (code === 0) {
      console.log("Compilation successful of CPP");
      runCode();
    } else {
      console.error(`Compilation failed with code ${code}`);
    }
  });
}

function runCode() {
  const testCases = [
    { input: "3\n4", expectedSum: 7 },
    { input: "5\n4", expectedSum: 9 },
    { input: "0\n0", expectedSum: 0 },
  ];

  console.log(`Testing for CPP:`);

  for (let currentIndex = 0; currentIndex < testCases.length; currentIndex++) {
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

    dockerContainer.stdin.write(`${testCases[currentIndex].input}\n`);
    dockerContainer.stdin.end();

    dockerContainer.stdout.on("data", (data) => {
      const output = data.toString().trim();

      const testCaseResult = {
        input: testCases[currentIndex].input,
        expectedSum: testCases[currentIndex].expectedSum,
        actualSum: parseInt(output),
        success: parseInt(output) === testCases[currentIndex].expectedSum,
      };

      console.log(testCaseResult);
    });

    dockerContainer.stderr.on("data", (stderr) => {
      console.error(`Docker container stderr: ${stderr}`);
    });

    dockerContainer.on("close", (code) => {
      console.log(`Docker container closed with code ${code}`);
    });
  }
}
