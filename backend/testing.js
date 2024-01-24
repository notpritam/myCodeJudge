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
  { a: 2, b: 3, expectedSum: 5 },
  { a: -1, b: 7, expectedSum: 6 },
  { a: 0, b: 0, expectedSum: 0 },
  // Add more test cases as needed
];

const dockerContainer = spawn(
  "docker",
  [
    "run",
    "--rm",
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

const input = testCases.map(({ a, b }) => `${a}\n${b}`).join("\n");
dockerContainer.stdin.write(input);
dockerContainer.stdin.end();

const results = [];

dockerContainer.stdout.on("data", (data) => {
  const outputLines = data.toString().trim().split("\n");
  outputLines.forEach((output, index) => {
    const testCaseResult = {
      input: testCases[index],
      expectedSum: testCases[index].expectedSum,
      actualSum: parseInt(output.trim()),
      success: parseInt(output.trim()) === testCases[index].expectedSum,
    };
    results.push(testCaseResult);
  });
});

dockerContainer.stderr.on("data", (stderr) => {
  console.error(`Docker container stderr: ${stderr}`);
});

dockerContainer.on("close", (code) => {
  console.log(`Docker container closed with code ${code}`);
  // Remove the temporary code file
  fs.unlinkSync(tempFile);

  // Return the results to the user
  console.log(results);
});
