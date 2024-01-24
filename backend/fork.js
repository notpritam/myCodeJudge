import { fork } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userCode = `
def add(a, b):
    return a + b

a = int(input())
b = int(input())
print(add(a, b))
`;

const tempFile = `main.py`;
fs.writeFileSync(tempFile, userCode, "utf-8");

const testCases = [
  { input: "3\n4", expectedSum: 7 },
  { input: "5\n4", expectedSum: 9 },
  { input: "0\n0", expectedSum: 0 },
];

for (let currentIndex = 0; currentIndex < testCases.length; currentIndex++) {
  const child = fork("child.js", [], {
    cwd: __dirname,
  });

  child.on("message", (output) => {
    const testCaseResult = {
      input: testCases[currentIndex].input,
      expectedSum: testCases[currentIndex].expectedSum,
      actualSum: parseInt(output),
      success: parseInt(output) === testCases[currentIndex].expectedSum,
    };

    console.log(testCaseResult);

    // Optionally, you can add cleanup logic here
    fs.unlinkSync(tempFile);
  });

  child.send(testCases[currentIndex].input);
}
