class BubbleSort {
    static generateSteps(array) {
        const steps = [];
        const n = array.length;
        let swapped;

        // Add initial step
        steps.push({
            type: 'init',
            array: [...array],
            description: "Let's start sorting these numbers! We'll compare them two at a time."
        });

        for (let i = 0; i < n - 1; i++) {
            swapped = false;

            // Add step showing we're starting a new pass
            steps.push({
                type: 'highlight',
                indices: [i],
                className: 'current',
                description: `Starting a new round! Let's look at the numbers from the beginning.`
            });

            for (let j = 0; j < n - i - 1; j++) {
                // Compare step
                steps.push({
                    type: 'compare',
                    indices: [j, j + 1],
                    description: `Looking at these two numbers: ${array[j]} and ${array[j + 1]}. Which one is bigger?`
                });

                if (array[j] > array[j + 1]) {
                    // Swap step
                    steps.push({
                        type: 'swap',
                        indices: [j, j + 1],
                        description: `Oops! The bigger number is on the left. Let's swap them to put the bigger number on the right!`
                    });

                    // Perform the swap
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    swapped = true;
                } else {
                    // No swap needed
                    steps.push({
                        type: 'highlight',
                        indices: [j, j + 1],
                        className: 'comparing',
                        description: `Good! The bigger number is already on the right. We can move on!`
                    });
                }
            }

            // Mark the last element as sorted
            steps.push({
                type: 'mark_sorted',
                indices: [n - i - 1],
                description: `Great! The biggest number has bubbled up to the top! It's in the right place now.`
            });

            if (!swapped) {
                // If no swaps occurred, the array is sorted
                steps.push({
                    type: 'mark_sorted',
                    indices: Array.from({length: n - i - 1}, (_, index) => index),
                    description: `Yay! All the numbers are in the right order now! We're done!`
                });
                break;
            }
        }

        // Add completion step
        steps.push({
            type: 'complete',
            array: [...array],
            description: "All done! The numbers are now sorted from smallest to biggest! 🎉"
        });

        return steps;
    }

    static getImplementation() {
        return {
            name: "Bubble Sort",
            description: "Bubble Sort is like playing a game where we compare numbers next to each other and swap them if they're in the wrong order. It's called 'Bubble Sort' because the bigger numbers 'bubble up' to the top, just like bubbles in water!",
            timeComplexity: {
                best: "O(n)",
                average: "O(n²)",
                worst: "O(n²)"
            },
            spaceComplexity: "O(1)",
            applications: [
                "Learning about sorting algorithms",
                "Understanding how to compare and swap numbers",
                "Seeing how algorithms work step by step"
            ],
            performanceNotes: "Bubble Sort is great for learning because it's simple to understand, but it's not the fastest way to sort numbers. It's like taking small steps to solve a problem!",
            code: `function bubbleSort(arr) {
    const n = arr.length;
    
    // Go through the array multiple times
    for (let i = 0; i < n - 1; i++) {
        // Compare each pair of numbers
        for (let j = 0; j < n - i - 1; j++) {
            // If the left number is bigger, swap them
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    
    return arr;
}`
        };
    }
} 