import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.on("message", (input) => {
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
      "/code/main.py",
    ],
    {
      stdio: ["pipe", "pipe", "pipe"],
    }
  );

  dockerContainer.stdin.write(`${input}\n`);
  dockerContainer.stdin.end();

  dockerContainer.stdout.on("data", (data) => {
    const output = data.toString().trim();
    process.send(output);
  });

  dockerContainer.stderr.on("data", (stderr) => {
    console.error(`Docker container stderr: ${stderr}`);
  });

  dockerContainer.on("close", (code) => {
    console.log(`Docker container closed with code ${code}`);
  });
});
