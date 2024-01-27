import fs from "fs";
import { spawn } from "child_process";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userCode = `
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

public class Main {
    public static class Solution {
        public List<List<String>> groupAnagrams(String[] strs) {
            Map<String, List<String>> groupedAnagrams = new HashMap<>();

            for (String str : strs) {
                char[] charArray = str.toCharArray();
                Arrays.sort(charArray);
                String sortedStr = new String(charArray);

                groupedAnagrams.computeIfAbsent(sortedStr, k -> new ArrayList<>()).add(str);
            }

            return new ArrayList<>(groupedAnagrams.values());
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int numTestCases = scanner.nextInt();
        for (int testCase = 1; testCase <= numTestCases; ++testCase) {

            int numStrings = scanner.nextInt();
            scanner.nextLine(); // consume the newline
            // System.out.println("Enter the strings:");
            String[] inputStrings = new String[numStrings];
            for (int i = 0; i < numStrings; ++i) {
                inputStrings[i] = scanner.nextLine();
            }

            // Call the function from the Solution class
            Solution solution = new Solution();
            List<List<String>> result = solution.groupAnagrams(inputStrings);

            for (List<String> group : result) {
                System.out.println(String.join(" ", group));
            }
        }

        scanner.close();
    }
}

`;

const fileName = "Main.java";
fs.writeFileSync(fileName, userCode, "utf-8");

const compileCommand = `docker run --rm -v ${__dirname}:/code coderunner_java javac ${fileName}`;

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
      console.log("Compilation successful of Java");
      runCode();
    } else {
      console.error(`Compilation failed with code ${code}`);
    }
  });
}

function runCode() {
  const customInput = `2\n3\neat\ntea\ntan\n4\nbat\ntab\ncat\nact\n`; // Customize this input
  const inputFilePath = "input.txt";
  const outputFilePath = "output.txt";

  fs.writeFileSync(inputFilePath, customInput, "utf-8");

  const dockerContainer = spawn(
    "docker",
    [
      "run",
      "--rm",
      "-i",
      "-v",
      `${__dirname}:/code`,
      "coderunner_java",
      "java",
      "Main",
    ],
    {
      stdio: ["pipe", "pipe", "pipe"],
    }
  );

  const inputStream = fs.createReadStream(inputFilePath);
  inputStream.pipe(dockerContainer.stdin);

  var outputValue = "";

  dockerContainer.stdout.on("data", (data) => {
    const output = data.toString();
    // console.log(`Output: \n${output}`);
    outputValue += output;
    fs.writeFileSync(outputFilePath, output, "utf-8");

    // console.log("Output written to output.txt");
  });

  dockerContainer.stderr.on("data", (stderr) => {
    console.error(`Docker container stderr: ${stderr}`);
  });

  dockerContainer.on("close", (code) => {
    console.log(`Output: \n${outputValue}`);
    console.log(`Docker container closed with code ${code}`);
  });
}
