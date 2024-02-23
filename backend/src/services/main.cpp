#include <iostream>
#include <unordered_set>
#include <string>

class Solution {
public:
    int lengthOfLongestSubstring(std::string s) {
        int n = s.length();
        std::unordered_set<char> charSet;
        int maxLength = 0, i = 0, j = 0;

        while (i < n && j < n) {
            if (charSet.find(s[j]) == charSet.end()) {
                charSet.insert(s[j++]);
                maxLength = std::max(maxLength, j - i);
            } else {
                charSet.erase(s[i++]);
            }
        }

        return maxLength;
    }
};

int main() {
    Solution solution;

    int numTestCases;
    std::cin >> numTestCases;

    for (int testCase = 1; testCase <= numTestCases; ++testCase) {
        std::string inputString;
        std::cin >> inputString;

        int result = solution.lengthOfLongestSubstring(inputString);
        std::cout << result << std::endl;
    }

    return 0;
}
