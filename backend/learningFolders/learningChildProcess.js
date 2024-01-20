import { spawn, exec } from "child_process";

const code_to_run = `
const sum= (a,b)=>{
    console.log("Hello from inside the function");
    return a+b;
};

sum(3,5);
`;

const child_process = spawn("node", ["-e", code_to_run]);

child_process.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

// const ls = spawn("ls", ["-lh", "/usr"]);

// ls.stdout.on("data", (data) => {
//   console.log(`stdout: ${data}`);
// });

// ls.stderr.on("data", (data) => {
//   console.error(`stderr: ${data}`);
// });

// ls.on("close", (code) => {
//   console.log(`child process exited with code ${code}`);
// });

// exec(code_to_run, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error: ${error.message}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// });

// const userInput = "3 5";

// exec(`node -e "${code_to_run}" "${userInput}"`, (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error: ${error.message}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
//   console.error(`stderr: ${stderr}`);
// });
