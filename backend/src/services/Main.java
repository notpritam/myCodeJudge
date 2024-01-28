import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Main {
    static class Solution {
        public int[] twoSum(int[] nums, int target) {
            Map<Integer, Integer> numIndices = new HashMap<>();

            for (int i = 0; i < nums.length; i++) {
                int complement = target - nums[i];
                if (numIndices.containsKey(complement)) {
                    return new int[]{numIndices.get(complement), i};
                }
                numIndices.put(nums[i], i);
            }
            return null;
        }
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        int numTestCases = scanner.nextInt();

        Solution solution = new Solution();

        for (int testCase = 1; testCase <= numTestCases; testCase++) {

            int n = scanner.nextInt();

            int[] nums = new int[n];
            for (int i = 0; i < n; i++) {
                nums[i] = scanner.nextInt();
            }

            int target = scanner.nextInt();

            int[] result = solution.twoSum(nums, target);

            System.out.println(result[0] + ", " + result[1]);
        }

        scanner.close();
    }
}
