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
  const code_to_run = `
        const sum= (a,b)=>{
            // console.log("Hello from inside the function");
            return a+b;
        };
        
        sum(3,5);
        `;
  //   const child_process = spawn("node", ["-e", code_to_run]);

  const lang = "js";
  const input = "";
  const code = "";

  const tempFile = `temp.${lang}`;

  fs.writeFileSync(tempFile, code, "utf-8");

  const dockerCommand = `docker run --rm -i --network none -v ${__dirname}:/code -w /code coderunner_${lang} /bin/bash -c "cat ${tempFile} | ${lang}"`;

  const child = exec(dockerCommand, (error, stdout, stderr) => {
    res.json({ stdout, stderr, error });
    // Remove the temporary code file
    fs.unlinkSync(codeFile);
  });

  // Pass input to the code through stdin
  child.stdin.write(input);
  child.stdin.end();

  //   fs.writeFile(fileName, code_to_run, (err) => {
  //     const child_process = fork(fileName);

  //     child_process.on("message", (data) => {});
  //   });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
