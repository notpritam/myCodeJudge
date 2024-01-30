class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        n = len(s)
        char_set = set()
        max_length = 0
        i, j = 0, 0

        while i < n and j < n:
            if s[j] not in char_set:
                char_set.add(s[j])
                max_length = max(max_length, j - i + 1)
                j += 1
            else:
                char_set.remove(s[i])
                i += 1

        return max_length

def main():
    solution = Solution()

    num_test_cases = int(input())
    for _ in range(num_test_cases):
        input_string = input()
        result = solution.lengthOfLongestSubstring(input_string)
        print(result)

if __name__ == "__main__":
    main()
