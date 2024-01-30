#include <iostream>
#include <unordered_map>
#include <vector>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> numIndices;

        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (numIndices.find(complement) != numIndices.end()) {
                return {numIndices[complement], i};
            }
            numIndices[nums[i]] = i;
        }

        return {};
    }
};

int main() {
    int numTestCases;
    std::cin >> numTestCases;
    Solution solution;

    for (int testCase = 1; testCase <= numTestCases; ++testCase) {
        int n;
        std::cin >> n;

        std::vector<int> nums(n);
        for (int i = 0; i < n; ++i) {
            std::cin >> nums[i];
        }

        int target;
        std::cin >> target;

        std::vector<int> result = solution.twoSum(nums, target);

        std::cout << result[0] << ", " << result[1] << std::endl;
    }

    return 0;
}
