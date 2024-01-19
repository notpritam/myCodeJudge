import { exec, fork, spawn } from "child_process";
import fs from "fs";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/evaluate", (req, res) => {
  console.log("Evaluate endpoint called");
  const code_to_run = `
        const sum= (a,b)=>{
            // console.log("Hello from inside the function");
            return a+b;
        };
        
        sum(3,5);
        `;
  //   const child_process = spawn("node", ["-e", code_to_run]);

  const lang = "c";
  const input = "5 10";
  const code = `#include <stdio.h>

  int main() {
      int num1, num2, sum;
  
      printf("Enter two integers: ");
      scanf("%d %d", &num1, &num2);
  
      sum = num1 + num2;
  
      printf("Sum: %d\n", sum);
  
      return 0;
  }`;

  const tempFile = `temp.${lang}`;

  fs.writeFileSync(tempFile, code, "utf-8");

  const dockerCommand = `docker run --rm -i --network none -v ${__dirname}:/code -w /code coderunner_${lang} /bin/bash -c "gcc -o temp ${tempFile}"`;
  const runCommand = `docker run --rm -i --network none -v ${__dirname}:/code -w /code coderunner_c /bin/bash -c "./temp"`;

  const child = exec(dockerCommand, (error, stdout, stderr) => {
    res.json({ stdout, stderr, error });

    exec(runCommand, (error, stdout, stderr) => {
      res.json({ stdout, stderr, error });
    });
    // Remove the temporary code file
    fs.unlinkSync(tempFile);
  });

  // Pass input to the code through stdin
  child.stdin.write(input);
  child.stdin.end();
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
