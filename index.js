import { exec, fork, spawn } from "child_process";
import fs from "fs";
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const evaluateFunction = (lang, code, input) => {
  let tempFile;
  let runCommand;
  let dockerCommand;
  let child_process;

  switch (lang) {
    case "c":
      tempFile = `temp.c`;

      fs.writeFileSync(tempFile, code, "utf-8");
      dockerCommand = `docker run --rm -i --network none -v ${__dirname}:/code -w /code coderunner_${lang} /bin/bash -c "gcc -o temp ${tempFile}"`;
      runCommand = `docker run --rm -i --network none -v ${__dirname}:/code -w /code coderunner_c /bin/bash -c "./temp"`;
      child_process = exec(dockerCommand, (error, stdout, stderr) => {
        res.json({ stdout, stderr, error });

        exec(runCommand, (error, stdout, stderr) => {
          res.json({ stdout, stderr, error });
        });
        // Remove the temporary code file
        fs.unlinkSync(tempFile);
      });

      // Pass input to the code through stdin
      child_process.stdin.write(input);
      child_process.stdin.end();
      break;
    case "javascript":
      tempFile = `temp.js`;
      fs.writeFileSync(tempFile, code, "utf-8");

      runCommand = `docker run --rm -i --network none -v ${__dirname}:/code -w /code coderunner /bin/bash -c "node ${tempFile}"`;
      child_process = exec(runCommand, (error, stdout, stderr) => {
        res.json({ stdout, stderr, error });
        // Remove the temporary code file
        fs.unlinkSync(tempFile);
      });

      child_process.stdin.write(input);
      child_process.stdin.end();

      break;
  }
};

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/evaluate", (req, res) => {
  const code_to_run = `
        const sum= (a,b)=>{
            // console.log("Hello from inside the function");
            return a+b;
        };
        
        sum(3,5);
        `;

  const lang = "javascript";
  const input = "5 10";
  const code = `console.log("Hello World");`;

  evaluateFunction(lang, code, input);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
