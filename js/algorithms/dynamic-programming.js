/**
 * Dynamic Programming Algorithms Implementation
 * Contains DP algorithm implementations with step-by-step visualization
 */

class DynamicProgrammingAlgorithms {
    static fibonacciDP(n) {
        const steps = [];
        const dp = new Array(n + 1).fill(0);
        
        if (n <= 1) {
            steps.push({
                type: 'base_case',
                n: n,
                result: n,
                description: `Base case: F(${n}) = ${n}`,
                code: 'if (n <= 1) return n;',
                highlight: [0]
            });
            
            return {
                steps,
                result: n,
                dp: [n],
                complexity: {
                    time: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
                    space: 'O(1)'
                },
                code: `function fibonacci(n) {
  if (n <= 1) return n;
  
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  
  return dp[n];
}`,
                explanation: "Dynamic Programming approach to Fibonacci avoids redundant calculations by storing previously computed values.",
                applications: [
                    "Mathematical computations",
                    "Algorithm optimization examples",
                    "Teaching DP concepts",
                    "Sequence generation"
                ]
            };
        }
        
        dp[0] = 0;
        dp[1] = 1;
        
        steps.push({
            type: 'init',
            n: n,
            dp: [...dp],
            description: `Computing F(${n}) using Dynamic Programming. Initialize F(0)=0, F(1)=1`,
            code: 'function fibonacci(n) {\n  const dp = new Array(n + 1);\n  dp[0] = 0;\n  dp[1] = 1;',
            highlight: [0, 1, 2, 3]
        });
        
        for (let i = 2; i <= n; i++) {
            dp[i] = dp[i-1] + dp[i-2];
            
            steps.push({
                type: 'compute',
                n: n,
                current: i,
                dp: [...dp],
                calculation: `F(${i}) = F(${i-1}) + F(${i-2}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
                description: `Computing F(${i}) = F(${i-1}) + F(${i-2}) = ${dp[i-1]} + ${dp[i-2]} = ${dp[i]}`,
                code: '  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];',
                highlight: [4, 5],
                stats: { computed: 1 }
            });
        }
        
        steps.push({
            type: 'complete',
            n: n,
            result: dp[n],
            dp: [...dp],
            description: `Fibonacci computation completed. F(${n}) = ${dp[n]}`,
            code: '  return dp[n];\n}',
            highlight: [6, 7]
        });

        return {
            steps,
            result: dp[n],
            dp: [...dp],
            complexity: {
                time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
                space: 'O(n)'
            },
            code: `function fibonacci(n) {
  if (n <= 1) return n;
  
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  
  return dp[n];
}`,
            explanation: "Dynamic Programming approach to Fibonacci avoids redundant calculations by storing previously computed values.",
            applications: [
                "Mathematical computations",
                "Algorithm optimization examples",
                "Teaching DP concepts",
                "Sequence generation"
            ]
        };
    }

    static knapsack(weights, values, capacity) {
        const steps = [];
        const n = weights.length;
        const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
        
        steps.push({
            type: 'init',
            weights: [...weights],
            values: [...values],
            capacity: capacity,
            dp: dp.map(row => [...row]),
            description: `Starting 0/1 Knapsack with capacity ${capacity} and ${n} items`,
            code: 'function knapsack(weights, values, capacity) {\n  const n = weights.length;\n  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));',
            highlight: [0, 1, 2]
        });

        for (let i = 1; i <= n; i++) {
            for (let w = 1; w <= capacity; w++) {
                const weight = weights[i-1];
                const value = values[i-1];
                
                steps.push({
                    type: 'consider_item',
                    weights: [...weights],
                    values: [...values],
                    capacity: capacity,
                    currentItem: i-1,
                    currentWeight: w,
                    itemWeight: weight,
                    itemValue: value,
                    dp: dp.map(row => [...row]),
                    description: `Considering item ${i-1}: weight=${weight}, value=${value} for capacity ${w}`,
                    code: '  for (let i = 1; i <= n; i++) {\n    for (let w = 1; w <= capacity; w++) {',
                    highlight: [3, 4]
                });

                if (weight <= w) {
                    const includeValue = value + dp[i-1][w-weight];
                    const excludeValue = dp[i-1][w];
                    
                    steps.push({
                        type: 'can_include',
                        weights: [...weights],
                        values: [...values],
                        currentItem: i-1,
                        currentWeight: w,
                        includeValue: includeValue,
                        excludeValue: excludeValue,
                        dp: dp.map(row => [...row]),
                        description: `Item fits! Include: ${value} + dp[${i-1}][${w-weight}] = ${includeValue}, Exclude: dp[${i-1}][${w}] = ${excludeValue}`,
                        code: '      if (weights[i-1] <= w) {\n        const includeValue = values[i-1] + dp[i-1][w-weights[i-1]];\n        const excludeValue = dp[i-1][w];',
                        highlight: [5, 6, 7],
                        stats: { comparisons: 1 }
                    });

                    dp[i][w] = Math.max(includeValue, excludeValue);
                    
                    steps.push({
                        type: 'update_dp',
                        weights: [...weights],
                        values: [...values],
                        currentItem: i-1,
                        currentWeight: w,
                        newValue: dp[i][w],
                        decision: dp[i][w] === includeValue ? 'include' : 'exclude',
                        dp: dp.map(row => [...row]),
                        description: `dp[${i}][${w}] = max(${includeValue}, ${excludeValue}) = ${dp[i][w]} (${dp[i][w] === includeValue ? 'include' : 'exclude'} item)`,
                        code: '        dp[i][w] = Math.max(includeValue, excludeValue);',
                        highlight: [8],
                        stats: { updated: 1 }
                    });
                } else {
                    dp[i][w] = dp[i-1][w];
                    
                    steps.push({
                        type: 'cannot_include',
                        weights: [...weights],
                        values: [...values],
                        currentItem: i-1,
                        currentWeight: w,
                        dp: dp.map(row => [...row]),
                        description: `Item too heavy (${weight} > ${w}). dp[${i}][${w}] = dp[${i-1}][${w}] = ${dp[i][w]}`,
                        code: '      } else {\n        dp[i][w] = dp[i-1][w];',
                        highlight: [9, 10],
                        stats: { skipped: 1 }
                    });
                }
            }
        }

        // Backtrack to find which items were selected
        const selectedItems = [];
        let i = n, w = capacity;
        
        while (i > 0 && w > 0) {
            if (dp[i][w] !== dp[i-1][w]) {
                selectedItems.unshift(i-1);
                w -= weights[i-1];
            }
            i--;
        }

        steps.push({
            type: 'complete',
            weights: [...weights],
            values: [...values],
            capacity: capacity,
            maxValue: dp[n][capacity],
            selectedItems: [...selectedItems],
            dp: dp.map(row => [...row]),
            description: `Knapsack completed. Maximum value: ${dp[n][capacity]}, Selected items: [${selectedItems.join(', ')}]`,
            code: '  return dp[n][capacity];\n}',
            highlight: [11, 12]
        });

        return {
            steps,
            maxValue: dp[n][capacity],
            selectedItems: [...selectedItems],
            dp: dp.map(row => [...row]),
            complexity: {
                time: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)' },
                space: 'O(nW)'
            },
            code: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i-1] <= w) {
        const includeValue = values[i-1] + dp[i-1][w-weights[i-1]];
        const excludeValue = dp[i-1][w];
        dp[i][w] = Math.max(includeValue, excludeValue);
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  
  return dp[n][capacity];
}`,
            explanation: "0/1 Knapsack problem finds the maximum value that can be obtained with given weight capacity by including or excluding each item.",
            applications: [
                "Resource allocation",
                "Budget optimization",
                "Portfolio selection",
                "Cargo loading"
            ]
        };
    }

    static longestCommonSubsequence(str1, str2) {
        const steps = [];
        const m = str1.length;
        const n = str2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        steps.push({
            type: 'init',
            str1: str1,
            str2: str2,
            dp: dp.map(row => [...row]),
            description: `Finding LCS of "${str1}" and "${str2}"`,
            code: 'function lcs(str1, str2) {\n  const m = str1.length, n = str2.length;\n  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));',
            highlight: [0, 1, 2]
        });

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const char1 = str1[i-1];
                const char2 = str2[j-1];
                
                steps.push({
                    type: 'compare_chars',
                    str1: str1,
                    str2: str2,
                    i: i-1,
                    j: j-1,
                    char1: char1,
                    char2: char2,
                    dp: dp.map(row => [...row]),
                    description: `Comparing '${char1}' (str1[${i-1}]) with '${char2}' (str2[${j-1}])`,
                    code: '  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (str1[i-1] === str2[j-1]) {',
                    highlight: [3, 4, 5],
                    stats: { comparisons: 1 }
                });

                if (char1 === char2) {
                    dp[i][j] = dp[i-1][j-1] + 1;
                    
                    steps.push({
                        type: 'chars_match',
                        str1: str1,
                        str2: str2,
                        i: i-1,
                        j: j-1,
                        char1: char1,
                        char2: char2,
                        newValue: dp[i][j],
                        dp: dp.map(row => [...row]),
                        description: `Characters match! dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1 = ${dp[i-1][j-1]} + 1 = ${dp[i][j]}`,
                        code: '        dp[i][j] = dp[i-1][j-1] + 1;',
                        highlight: [6],
                        stats: { matches: 1 }
                    });
                } else {
                    dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
                    
                    steps.push({
                        type: 'chars_differ',
                        str1: str1,
                        str2: str2,
                        i: i-1,
                        j: j-1,
                        char1: char1,
                        char2: char2,
                        newValue: dp[i][j],
                        dp: dp.map(row => [...row]),
                        description: `Characters differ. dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}]) = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`,
                        code: '      } else {\n        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);',
                        highlight: [7, 8],
                        stats: { mismatches: 1 }
                    });
                }
            }
        }

        // Reconstruct LCS
        let lcs = '';
        let i = m, j = n;
        
        while (i > 0 && j > 0) {
            if (str1[i-1] === str2[j-1]) {
                lcs = str1[i-1] + lcs;
                i--;
                j--;
            } else if (dp[i-1][j] > dp[i][j-1]) {
                i--;
            } else {
                j--;
            }
        }

        steps.push({
            type: 'complete',
            str1: str1,
            str2: str2,
            lcsLength: dp[m][n],
            lcsString: lcs,
            dp: dp.map(row => [...row]),
            description: `LCS completed. Length: ${dp[m][n]}, LCS: "${lcs}"`,
            code: '  return dp[m][n];\n}',
            highlight: [9, 10]
        });

        return {
            steps,
            lcsLength: dp[m][n],
            lcsString: lcs,
            dp: dp.map(row => [...row]),
            complexity: {
                time: { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)' },
                space: 'O(mn)'
            },
            code: `function lcs(str1, str2) {
  const m = str1.length, n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  
  return dp[m][n];
}`,
            explanation: "Longest Common Subsequence finds the longest sequence that appears in both strings in the same relative order.",
            applications: [
                "DNA sequence analysis",
                "File comparison (diff tools)",
                "Version control systems",
                "Plagiarism detection"
            ]
        };
    }

    static editDistance(str1, str2) {
        const steps = [];
        const m = str1.length;
        const n = str2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        // Initialize base cases
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        
        steps.push({
            type: 'init',
            str1: str1,
            str2: str2,
            dp: dp.map(row => [...row]),
            description: `Computing edit distance between "${str1}" and "${str2}". Initialize base cases.`,
            code: 'function editDistance(str1, str2) {\n  const m = str1.length, n = str2.length;\n  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));\n  \n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;',
            highlight: [0, 1, 2, 3, 4, 5]
        });

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const char1 = str1[i-1];
                const char2 = str2[j-1];
                
                steps.push({
                    type: 'compare_chars',
                    str1: str1,
                    str2: str2,
                    i: i-1,
                    j: j-1,
                    char1: char1,
                    char2: char2,
                    dp: dp.map(row => [...row]),
                    description: `Comparing '${char1}' (str1[${i-1}]) with '${char2}' (str2[${j-1}])`,
                    code: '  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (str1[i-1] === str2[j-1]) {',
                    highlight: [6, 7, 8],
                    stats: { comparisons: 1 }
                });

                if (char1 === char2) {
                    dp[i][j] = dp[i-1][j-1];
                    
                    steps.push({
                        type: 'chars_match',
                        str1: str1,
                        str2: str2,
                        i: i-1,
                        j: j-1,
                        char1: char1,
                        char2: char2,
                        newValue: dp[i][j],
                        dp: dp.map(row => [...row]),
                        description: `Characters match! No operation needed. dp[${i}][${j}] = dp[${i-1}][${j-1}] = ${dp[i][j]}`,
                        code: '        dp[i][j] = dp[i-1][j-1];',
                        highlight: [9],
                        stats: { matches: 1 }
                    });
                } else {
                    const insert = dp[i][j-1] + 1;
                    const delete_ = dp[i-1][j] + 1;
                    const replace = dp[i-1][j-1] + 1;
                    
                    dp[i][j] = Math.min(insert, delete_, replace);
                    
                    let operation = 'replace';
                    if (dp[i][j] === insert) operation = 'insert';
                    else if (dp[i][j] === delete_) operation = 'delete';
                    
                    steps.push({
                        type: 'chars_differ',
                        str1: str1,
                        str2: str2,
                        i: i-1,
                        j: j-1,
                        char1: char1,
                        char2: char2,
                        insert: insert,
                        delete: delete_,
                        replace: replace,
                        operation: operation,
                        newValue: dp[i][j],
                        dp: dp.map(row => [...row]),
                        description: `Characters differ. Insert: ${insert}, Delete: ${delete_}, Replace: ${replace}. Choose ${operation}: dp[${i}][${j}] = ${dp[i][j]}`,
                        code: '      } else {\n        dp[i][j] = Math.min(dp[i][j-1] + 1, dp[i-1][j] + 1, dp[i-1][j-1] + 1);',
                        highlight: [10, 11],
                        stats: { operations: 1 }
                    });
                }
            }
        }

        steps.push({
            type: 'complete',
            str1: str1,
            str2: str2,
            editDistance: dp[m][n],
            dp: dp.map(row => [...row]),
            description: `Edit distance completed. Minimum operations needed: ${dp[m][n]}`,
            code: '  return dp[m][n];\n}',
            highlight: [12, 13]
        });

        return {
            steps,
            editDistance: dp[m][n],
            dp: dp.map(row => [...row]),
            complexity: {
                time: { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)' },
                space: 'O(mn)'
            },
            code: `function editDistance(str1, str2) {
  const m = str1.length, n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = Math.min(
          dp[i][j-1] + 1,    // Insert
          dp[i-1][j] + 1,    // Delete
          dp[i-1][j-1] + 1   // Replace
        );
      }
    }
  }
  
  return dp[m][n];
}`,
            explanation: "Edit Distance (Levenshtein Distance) finds the minimum number of operations (insert, delete, replace) to transform one string into another.",
            applications: [
                "Spell checkers",
                "DNA sequence alignment",
                "Plagiarism detection",
                "Auto-correction systems"
            ]
        };
    }

    static coinChange(coins, amount) {
        const steps = [];
        const dp = new Array(amount + 1).fill(Infinity);
        dp[0] = 0;
        
        steps.push({
            type: 'init',
            coins: [...coins],
            amount: amount,
            dp: [...dp],
            description: `Finding minimum coins needed for amount ${amount} using coins [${coins.join(', ')}]`,
            code: 'function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;',
            highlight: [0, 1, 2]
        });

        for (let i = 1; i <= amount; i++) {
            steps.push({
                type: 'consider_amount',
                coins: [...coins],
                amount: amount,
                currentAmount: i,
                dp: [...dp],
                description: `Finding minimum coins for amount ${i}`,
                code: '  for (let i = 1; i <= amount; i++) {',
                highlight: [3]
            });

            for (const coin of coins) {
                if (coin <= i) {
                    const newCoins = dp[i - coin] + 1;
                    
                    steps.push({
                        type: 'try_coin',
                        coins: [...coins],
                        currentAmount: i,
                        coin: coin,
                        previousAmount: i - coin,
                        previousCoins: dp[i - coin],
                        newCoins: newCoins,
                        currentMin: dp[i],
                        dp: [...dp],
                        description: `Using coin ${coin}: dp[${i - coin}] + 1 = ${dp[i - coin]} + 1 = ${newCoins}. Current min: ${dp[i] === Infinity ? '∞' : dp[i]}`,
                        code: '    for (const coin of coins) {\n      if (coin <= i) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);',
                        highlight: [4, 5, 6],
                        stats: { tried: 1 }
                    });

                    if (newCoins < dp[i]) {
                        dp[i] = newCoins;
                        
                        steps.push({
                            type: 'update_min',
                            coins: [...coins],
                            currentAmount: i,
                            coin: coin,
                            newMin: dp[i],
                            dp: [...dp],
                            description: `New minimum found! dp[${i}] = ${dp[i]} (using coin ${coin})`,
                            code: '        dp[i] = Math.min(dp[i], dp[i - coin] + 1);',
                            highlight: [6],
                            stats: { updated: 1 }
                        });
                    }
                }
            }
        }

        const result = dp[amount] === Infinity ? -1 : dp[amount];

        steps.push({
            type: 'complete',
            coins: [...coins],
            amount: amount,
            result: result,
            dp: [...dp],
            description: result === -1 ? 
                `Cannot make amount ${amount} with given coins` : 
                `Minimum coins needed for amount ${amount}: ${result}`,
            code: '  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
            highlight: [7, 8]
        });

        return {
            steps,
            result: result,
            dp: [...dp],
            complexity: {
                time: { best: 'O(amount × coins)', average: 'O(amount × coins)', worst: 'O(amount × coins)' },
                space: 'O(amount)'
            },
            code: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
            explanation: "Coin Change problem finds the minimum number of coins needed to make a given amount using dynamic programming.",
            applications: [
                "Currency exchange systems",
                "Vending machines",
                "Payment processing",
                "Resource optimization"
            ]
        };
    }

    static getAlgorithm(algorithmId) {
        const algorithms = {
            'fibonacci-dp': this.fibonacciDP,
            'knapsack': this.knapsack,
            'lcs': this.longestCommonSubsequence,
            'edit-distance': this.editDistance,
            'coin-change': this.coinChange
        };

        return algorithms[algorithmId] || null;
    }

    static generateSteps(algorithmId) {
        const algorithm = this.getAlgorithm(algorithmId);
        if (!algorithm) return [];
        
        let result;
        switch (algorithmId) {
            case 'fibonacci-dp':
                result = algorithm(10);
                break;
            case 'knapsack':
                result = algorithm([2, 1, 3, 2], [12, 10, 20, 15], 5);
                break;
            case 'lcs':
                result = algorithm("ABCDGH", "AEDFHR");
                break;
            case 'edit-distance':
                result = algorithm("kitten", "sitting");
                break;
            case 'coin-change':
                result = algorithm([1, 3, 4], 6);
                break;
            default:
                return [];
        }
        
        return result.steps || [];
    }

    static getImplementation(algorithmId) {
        const implementations = {
            'fibonacci-dp': {
                timeComplexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
                spaceComplexity: 'O(n)',
                code: `function fibonacci(n) {
  if (n <= 1) return n;
  
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  
  return dp[n];
}`,
                description: "Dynamic Programming approach to Fibonacci avoids redundant calculations by storing previously computed values.",
                applications: [
                    "Mathematical computations",
                    "Algorithm optimization examples",
                    "Teaching DP concepts",
                    "Sequence generation"
                ],
                performanceNotes: "Reduces exponential time complexity to linear. Space can be optimized to O(1) by storing only last two values."
            },
            'knapsack': {
                timeComplexity: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)' },
                spaceComplexity: 'O(nW)',
                code: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i-1] <= w) {
        const includeValue = values[i-1] + dp[i-1][w-weights[i-1]];
        const excludeValue = dp[i-1][w];
        dp[i][w] = Math.max(includeValue, excludeValue);
      } else {
        dp[i][w] = dp[i-1][w];
      }
    }
  }
  
  return dp[n][capacity];
}`,
                description: "0/1 Knapsack problem finds the maximum value that can be obtained with given weight capacity by including or excluding each item.",
                applications: [
                    "Resource allocation",
                    "Budget optimization",
                    "Portfolio selection",
                    "Cargo loading"
                ],
                performanceNotes: "Pseudo-polynomial time complexity. Space can be optimized to O(W) using 1D array."
            },
            'lcs': {
                timeComplexity: { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)' },
                spaceComplexity: 'O(mn)',
                code: `function lcs(str1, str2) {
  const m = str1.length, n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  
  return dp[m][n];
}`,
                description: "Longest Common Subsequence finds the longest sequence that appears in both strings in the same relative order.",
                applications: [
                    "DNA sequence analysis",
                    "File comparison (diff tools)",
                    "Version control systems",
                    "Plagiarism detection"
                ],
                performanceNotes: "Classic DP problem. Space can be optimized to O(min(m,n)) using rolling array technique."
            },
            'edit-distance': {
                timeComplexity: { best: 'O(mn)', average: 'O(mn)', worst: 'O(mn)' },
                spaceComplexity: 'O(mn)',
                code: `function editDistance(str1, str2) {
  const m = str1.length, n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = Math.min(
          dp[i][j-1] + 1,    // Insert
          dp[i-1][j] + 1,    // Delete
          dp[i-1][j-1] + 1   // Replace
        );
      }
    }
  }
  
  return dp[m][n];
}`,
                description: "Edit Distance (Levenshtein Distance) finds the minimum number of operations to transform one string into another.",
                applications: [
                    "Spell checkers",
                    "DNA sequence alignment",
                    "Plagiarism detection",
                    "Auto-correction systems"
                ],
                performanceNotes: "Also known as Levenshtein Distance. Space complexity can be reduced to O(min(m,n))."
            },
            'coin-change': {
                timeComplexity: { best: 'O(amount × coins)', average: 'O(amount × coins)', worst: 'O(amount × coins)' },
                spaceComplexity: 'O(amount)',
                code: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
                description: "Coin Change problem finds the minimum number of coins needed to make a given amount using dynamic programming.",
                applications: [
                    "Currency exchange systems",
                    "Vending machines",
                    "Payment processing",
                    "Resource optimization"
                ],
                performanceNotes: "Bottom-up approach with optimal substructure. Can be extended to find actual coin combination."
            }
        };

        return implementations[algorithmId] || null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicProgrammingAlgorithms;
}

// Make available globally
window.DynamicProgrammingAlgorithms = DynamicProgrammingAlgorithms; 