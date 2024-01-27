
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

