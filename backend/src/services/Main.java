import java.util.HashSet;
import java.util.Set;
import java.util.Scanner;

public class Main {
    public static class Solution {
        public int lengthOfLongestSubstring(String s) {
            int n = s.length();
            Set<Character> set = new HashSet<>();
            int maxLength = 0, i = 0, j = 0;

            while (i < n && j < n) {
                if (!set.contains(s.charAt(j))) {
                    set.add(s.charAt(j++));
                    maxLength = Math.max(maxLength, j - i);
                } else {
                    set.remove(s.charAt(i++));
                }
            }

          //Adding the solution also to save time...
        return maxLength;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Solution solution = new Solution();

        int numTestCases = scanner.nextInt();
        scanner.nextLine();
        for (int testCase = 1; testCase <= numTestCases; ++testCase) {

            String inputString = scanner.nextLine();

            int result = solution.lengthOfLongestSubstring(inputString);
            System.out.println(result);
        }

        scanner.close();
    }
}