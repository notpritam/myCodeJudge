import fs from "fs";
import { spawn } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";
import e from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// User code in Python, C++, and Java
const userCodes = {
  python: `
def add(a, b):
    return a + b

a = int(input())
b = int(input())
print(add(a, b))
`,
  cpp: `
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}
`,
  java: `
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(a + b);
    }
}
`,
};

// Testing for Python, C++, and Java
const languages = ["python", "cpp", "java"];

languages.forEach((language) => {
  var extension = "";
  var fileName = "";
  var mainString = "";
  var compileCommand = "";
  var userCode = userCodes[language];

  if (language === "cpp") {
    fileName = "main.cpp";
  } else if (language === "java") {
    fileName = "Main.java";
  } else if (language === "python") {
    fileName = "main.py";
  }
  const tempFile = fileName;
  fs.writeFileSync(tempFile, userCode, "utf-8");

  if (language === "cpp") {
    extension = "cpp";
    mainString = "./main"; // Specify the executable file name
    compileCommand = `docker run --rm -v ${__dirname}:/code coderunner_cpp g++ -o main ${tempFile}`;
  } else if (language === "java") {
    extension = "java";
    mainString = " java Main";
    compileCommand = `docker run --rm -v ${__dirname}:/code coderunner_java javac ${tempFile}`;
  } else if (language === "python") {
    extension = "py";
    mainString = "python3 main.py";
  }

  if (compileCommand) {
    // Compile code for C++ and Java
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
        runCode();
      } else {
        console.error(`Compilation failed with code ${code}`);
      }
    });
  } else {
    runCode();
  }

  function runCode() {
    const testCases = [
      { input: "3\n4", expectedSum: 7 },
      { input: "5\n4", expectedSum: 9 },
      { input: "0\n0", expectedSum: 0 },
    ];

    console.log(`Testing for ${language}:`);

    for (
      let currentIndex = 0;
      currentIndex < testCases.length;
      currentIndex++
    ) {
      const dockerContainer = spawn(
        "docker",
        [
          "run",
          "--rm",
          "-i",
          "-v",
          `${__dirname}:/code`,
          language === "cpp"
            ? "coderunner_cpp"
            : language === "java"
            ? "coderunner_java"
            : "coderunner_python",
          mainString,
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
});
