import fs from "fs";
import { spawn } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userCode = `
def add(a, b):
    return a + b

a = int(input())
b = int(input())
print(add(a, b))
`; // User's code
const tempFile = `main.py`;
fs.writeFileSync(tempFile, userCode, "utf-8");

const testCases = [
  { input: "3\n4", expectedSum: 5 },
  { input: "5\n4", expectedSum: 6 },
  { input: "0\n0", expectedSum: 0 },
  // Add more test cases as needed
];

for (let currentIndex = 0; currentIndex < testCases.length; currentIndex++) {
  const dockerContainer = spawn(
    "docker",
    [
      "run",
      "-i", // Pass input through stdin
      "-v",
      `${__dirname}:/code`,
      "coderunner_python",
      "python3",
      "/code/main.py",
    ],
    {
      stdio: ["pipe", "pipe", "pipe"],
    }
  );
  dockerContainer.stdin.write(`${testCases[currentIndex].input}\n`);
  dockerContainer.stdout.on("data", (data) => {
    const output = data.toString().trim();
    console.log(output, `thisis index ${currentIndex}`);

    const testCaseResult = {
      input: testCases[currentIndex].input,
      expectedSum: testCases[currentIndex].expectedSum,
      actualSum: parseInt(output),
      success: parseInt(output) === testCases[currentIndex].expectedSum,
    };

    console.log(testCaseResult);

    currentIndex++;

    if (currentIndex < testCases.length) {
      // Write input for the next test case
      const nextInput = `${testCases[currentIndex].a}\n${testCases[currentIndex].b}\n`;
      dockerContainer.stdin.write(nextInput);
    } else {
      // All test cases processed, close stdin
      dockerContainer.stdin.end();
    }
  });

  dockerContainer.stderr.on("data", (stderr) => {
    console.error(`Docker container stderr: ${stderr}`);
  });
  dockerContainer.on("close", (code) => {
    console.log(`Docker container closed with code ${code}`);
    // Remove the temporary code file
    // fs.unlinkSync(tempFile);
  });
}
// fs.unlinkSync(tempFile);

// dockerContainer.on("close", (code) => {
//   console.log(`Docker container closed with code ${code}`);
//   // Remove the temporary code file
//   fs.unlinkSync(tempFile);
// });
