/**
 * DSA Visualizer - Animation Controller
 * Manages step-by-step execution of algorithm animations
 */

class AnimationController {
    constructor(visualizer, speed = 5) {
        this.visualizer = visualizer;
        this.speed = speed;
        this.steps = [];
        this.currentStep = 0;
        this.isPlaying = false;
        this.isPaused = false;
        this.animationId = null;
        this.stepDelay = this.calculateDelay(speed);
        this.isInitialized = false;
        this.testMode = false;
        this.isCompleting = false;
        this.isExecuting = false;

        // Callbacks
        this.onStepChange = null;
        this.onStatsUpdate = null;
        this.onComplete = null;
        this.onExplanationUpdate = null;
    }

    // Test helper methods
    static runTests() {
        console.group('Animation Controller Tests');
        
        // Test 1: Basic initialization
        console.log('Test 1: Basic initialization');
        const visualizer = { setData: () => {}, clearHighlights: () => {} };
        const controller = new AnimationController(visualizer);
        console.assert(!controller.isPlaying, 'Should not be playing initially');
        console.assert(!controller.isPaused, 'Should not be paused initially');
        console.assert(controller.currentStep === 0, 'Should start at step 0');
        console.assert(controller.steps.length === 0, 'Should have no steps initially');
        
        // Test 2: Setting steps
        console.log('Test 2: Setting steps');
        const testSteps = [
            { type: 'init', array: [1, 2, 3] },
            { type: 'highlight', indices: [0] },
            { type: 'highlight', indices: [1] }
        ];
        controller.setSteps(testSteps);
        console.assert(controller.steps.length === 3, 'Should have 3 steps');
        console.assert(controller.isInitialized, 'Should be initialized after setting steps');
        
        // Test 3: Starting animation
        console.log('Test 3: Starting animation');
        controller.start();
        console.assert(controller.isPlaying, 'Should be playing after start');
        console.assert(!controller.isPaused, 'Should not be paused after start');
        
        // Test 4: Pausing animation
        console.log('Test 4: Pausing animation');
        controller.pause();
        console.assert(!controller.isPlaying, 'Should not be playing after pause');
        console.assert(controller.isPaused, 'Should be paused after pause');
        
        // Test 5: Resuming animation
        console.log('Test 5: Resuming animation');
        controller.resume();
        console.assert(controller.isPlaying, 'Should be playing after resume');
        console.assert(!controller.isPaused, 'Should not be paused after resume');
        
        // Test 6: Completing animation
        console.log('Test 6: Completing animation');
        controller.complete();
        console.assert(!controller.isPlaying, 'Should not be playing after complete');
        console.assert(!controller.isPaused, 'Should not be paused after complete');
        
        console.groupEnd();
        return true;
    }

    calculateDelay(speed) {
        // Speed 1 = 1000ms, Speed 10 = 100ms
        return Math.max(100, 1100 - (speed * 100));
    }

    setSpeed(speed) {
        this.speed = speed;
        this.stepDelay = this.calculateDelay(speed);
    }

    setSteps(steps) {
        console.log('Setting steps:', steps.length);
        this.steps = steps;
        this.currentStep = 0;
        this.isInitialized = true;
        this.isCompleting = false;
        this.isExecuting = false;
        this.notifyStepChange();
    }

    start() {
        if (this.steps.length === 0) {
            console.log('No steps to animate');
            return;
        }

        if (!this.isInitialized) {
            console.log('Animation not initialized');
            return;
        }

        console.log('Starting animation with', this.steps.length, 'steps');
        this.isPlaying = true;
        this.isPaused = false;
        this.isCompleting = false;
        this.isExecuting = false;
        
        this.executeNextStep();
    }

    executeNextStep() {
        if (this.isExecuting) {
            console.log('Already executing step, skipping');
            return;
        }

        console.log('executeNextStep called - isPlaying:', this.isPlaying, 'step:', this.currentStep, 'total:', this.steps.length);
        
        if (!this.isPlaying || this.currentStep >= this.steps.length) {
            console.log('Stopping - isPlaying:', this.isPlaying, 'completed:', this.currentStep >= this.steps.length);
            if (this.currentStep >= this.steps.length && !this.isCompleting) {
                this.complete();
            }
            return;
        }

        this.isExecuting = true;
        try {
            this.executeStep(this.currentStep);
            this.currentStep++;
            this.notifyStepChange();

            if (this.currentStep < this.steps.length) {
                console.log('Scheduling next step with delay:', this.stepDelay);
                console.log('Page visible:', !document.hidden);
                
                // Clear any existing timeout
                this.clearTimeout();
                
                // Store the timeout ID
                this.animationId = setTimeout(() => {
                    console.log('Timeout fired, calling executeNextStep again');
                    this.animationId = null;
                    this.isExecuting = false;
                    if (this.isPlaying && !this.isCompleting) {
                        this.executeNextStep();
                    }
                }, this.stepDelay);
                
                console.log('Timeout scheduled with ID:', this.animationId);
            } else {
                this.complete();
            }
        } catch (error) {
            console.error('Error executing step:', error);
            this.isExecuting = false;
        }
    }

    complete() {
        if (this.isCompleting) {
            console.log('Already completing, skipping duplicate completion');
            return;
        }
        
        console.log('Animation completed');
        this.isCompleting = true;
        this.isPlaying = false;
        this.isPaused = false;
        this.clearTimeout();

        if (this.onComplete) {
            this.onComplete();
        }
        
        this.isCompleting = false;
    }

    pause() {
        if (!this.isInitialized) return;
        
        // Prevent multiple pause calls
        if (!this.isPlaying) {
            console.log('Animation already paused');
            return;
        }
        
        console.log('Pausing animation at step', this.currentStep);
        this.isPlaying = false;
        this.isPaused = true;
        this.clearTimeout();
    }

    resume() {
        if (!this.isInitialized) return;
        
        // Prevent multiple resume calls
        if (this.isPlaying) {
            console.log('Animation already playing');
            return;
        }
        
        if (this.isPaused && this.currentStep < this.steps.length) {
            console.log('Resuming animation from step', this.currentStep);
            this.isPlaying = true;
            this.isPaused = false;
            
            // Clear any existing timeout
            this.clearTimeout();
            
            // Schedule next step
            this.animationId = setTimeout(() => {
                console.log('Timeout fired after resume, calling executeNextStep');
                this.animationId = null;
                if (this.isPlaying && !this.isCompleting) {
                    this.executeNextStep();
                }
            }, this.stepDelay);
        }
    }

    reset() {
        if (!this.isInitialized) return;
        
        this.pause();
        this.currentStep = 0;
        this.isCompleting = false;
        this.isExecuting = false;
        this.notifyStepChange();

        if (this.visualizer && this.visualizer.reset) {
            this.visualizer.reset();
        }
    }

    stepForward() {
        if (this.currentStep < this.steps.length) {
            this.executeStep(this.currentStep);
            this.currentStep++;
            this.notifyStepChange();

            if (this.currentStep >= this.steps.length) {
                this.complete();
            }
        }
    }

    stepBack() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.replayToCurrentStep();
            this.notifyStepChange();
        }
    }

    fastForward() {
        this.pause();

        const fastExecute = () => {
            if (this.currentStep < this.steps.length) {
                this.executeStep(this.currentStep);
                this.currentStep++;
                this.notifyStepChange();

                // Use a very short delay for fast forward
                setTimeout(fastExecute, 50);
            } else {
                this.complete();
            }
        };

        fastExecute();
    }

    executeStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) return;

        const step = this.steps[stepIndex];

        try {
            // Update visualizer data if step contains array information
            if (step.array && this.visualizer && this.visualizer.setData) {
                this.visualizer.setData(step.array);
            }

            switch (step.type) {
                case 'highlight':
                    this.executeHighlight(step);
                    break;
                case 'compare':
                    this.executeCompare(step);
                    break;
                case 'swap':
                    this.executeSwap(step);
                    break;
                case 'move':
                    this.executeMove(step);
                    break;
                case 'mark_sorted':
                    this.executeMarkSorted(step);
                    break;
                case 'set_pivot':
                    this.executeSetPivot(step);
                    break;
                case 'visit_node':
                    this.executeVisitNode(step);
                    break;
                case 'visit_cell':
                    this.executeVisitCell(step);
                    break;
                case 'mark_path':
                    this.executeMarkPath(step);
                    break;
                case 'calculate_dp':
                    this.executeCalculateDP(step);
                    break;
                case 'push':
                    this.executePush(step);
                    break;
                case 'pop':
                    this.executePop(step);
                    break;
                case 'enqueue':
                    this.executeEnqueue(step);
                    break;
                case 'dequeue':
                    this.executeDequeue(step);
                    break;
                case 'peek':
                    this.executePeek(step);
                    break;
                case 'clear_highlights':
                    this.executeClearHighlights(step);
                    break;
                case 'init':
                    this.executeInit(step);
                    break;
                case 'complete':
                    this.executeComplete(step);
                    break;
                case 'visit':
                    this.executeVisit(step);
                    break;
                case 'explore':
                    this.executeExplore(step);
                    break;
                case 'found':
                    this.executeFound(step);
                    break;
                case 'not_found':
                    this.executeNotFound(step);
                    break;
                case 'select':
                    this.executeSelect(step);
                    break;
                case 'update_min':
                    this.executeUpdateMin(step);
                    break;
                case 'sorted':
                    this.executeSorted(step);
                    break;
                case 'divide':
                    this.executeDivide(step);
                    break;
                case 'place':
                    this.executePlace(step);
                    break;
                case 'pivot':
                    this.executePivot(step);
                    break;
                case 'pivot_place':
                    this.executePivotPlace(step);
                    break;
                case 'search_right':
                    this.executeSearchRight(step);
                    break;
                case 'search_left':
                    this.executeSearchLeft(step);
                    break;
                case 'calculate_mid':
                    this.executeCalculateMid(step);
                    break;
                case 'jump':
                    this.executeJump(step);
                    break;
                case 'block_found':
                    this.executeBlockFound(step);
                    break;
                case 'linear_search':
                    this.executeLinearSearch(step);
                    break;
                case 'interpolate':
                    this.executeInterpolate(step);
                    break;
                case 'single_element':
                    this.executeSingleElement(step);
                    break;
                case 'shift':
                    this.executeShift(step);
                    break;
                case 'insert':
                    this.executeInsert(step);
                    break;
                case 'heapify_start':
                    this.executeHeapifyStart(step);
                    break;
                case 'update_largest':
                    this.executeUpdateLargest(step);
                    break;
                case 'build_heap':
                    this.executeBuildHeap(step);
                    break;
                case 'heap_built':
                    this.executeHeapBuilt(step);
                    break;
                case 'extract':
                    this.executeExtract(step);
                    break;
                case 'update_distance':
                    this.executeUpdateDistance(step);
                    break;
                case 'path_found':
                    this.executePathFound(step);
                    break;
                case 'no_path':
                    this.executeNoPath(step);
                    break;
                case 'update_scores':
                    this.executeUpdateScores(step);
                    break;
                case 'transpose':
                    this.executeTranspose(step);
                    break;
                case 'transpose_complete':
                    this.executeTransposeComplete(step);
                    break;
                case 'find_components':
                    this.executeFindComponents(step);
                    break;
                case 'component_found':
                    this.executeComponentFound(step);
                    break;
                case 'fill_visit':
                    this.executeFillVisit(step);
                    break;
                case 'fill_finish':
                    this.executeFillFinish(step);
                    break;
                case 'scc_visit':
                    this.executeSccVisit(step);
                    break;
                case 'finish':
                    this.executeFinish(step);
                    break;
                case 'base_case':
                    this.executeBaseCase(step);
                    break;
                case 'compute':
                    this.executeCompute(step);
                    break;
                case 'consider_item':
                    this.executeConsiderItem(step);
                    break;
                case 'can_include':
                    this.executeCanInclude(step);
                    break;
                case 'cannot_include':
                    this.executeCannotInclude(step);
                    break;
                case 'update_dp':
                    this.executeUpdateDp(step);
                    break;
                case 'compare_chars':
                    this.executeCompareChars(step);
                    break;
                case 'chars_match':
                    this.executeCharsMatch(step);
                    break;
                case 'chars_differ':
                    this.executeCharsDiffer(step);
                    break;
                case 'consider_amount':
                    this.executeConsiderAmount(step);
                    break;
                case 'try_coin':
                    this.executeTryCoin(step);
                    break;
                case 'front':
                    this.executeFront(step);
                    break;
                case 'insert_head':
                    this.executeInsertHead(step);
                    break;
                case 'delete_node':
                    this.executeDeleteNode(step);
                    break;
                case 'search_node':
                    this.executeSearchNode(step);
                    break;
                case 'hash_insert':
                    this.executeHashInsert(step);
                    break;
                case 'hash_search':
                    this.executeHashSearch(step);
                    break;
                case 'hash_delete':
                    this.executeHashDelete(step);
                    break;
                case 'pop_empty':
                case 'dequeue_empty':
                case 'peek_empty':
                case 'front_empty':
                case 'delete_empty':
                case 'search_not_found':
                case 'delete_not_found':
                    this.executeEmptyOperation(step);
                    break;
                case 'insert_middle':
                case 'delete_head':
                case 'delete_middle':
                case 'search_start':
                case 'search_compare':
                case 'search_found':
                case 'hash_key':
                case 'update':
                case 'search_hash':
                case 'delete_hash':
                case 'delete_found':
                    this.executeDataStructureOperation(step);
                    break;
                case 'clear_highlights':
                    this.executeClearHighlights(step);
                    break;
                default:
                    console.warn(`Unknown step type: ${step.type}`);
            }

            // Update explanation if provided
            if (step.description && this.onExplanationUpdate) {
                this.onExplanationUpdate(step.description);
            }

            // Update stats if provided
            if (step.stats && this.onStatsUpdate) {
                this.onStatsUpdate(step.stats);
            }

        } catch (error) {
            console.error('Error executing step:', error, step);
        }
    }

    executeHighlight(step) {
        if (this.visualizer && this.visualizer.highlight) {
            const indices = step.indices || step.comparing || step.selected || step.found || 
                           (step.current !== undefined ? [step.current] : null);
            
            if (indices && indices.length > 0) {
                this.visualizer.highlight(indices, step.className || 'current');
            }
        }
    }

    executeCompare(step) {
        if (this.visualizer && this.visualizer.highlight) {
            const indices = step.indices || step.comparing;
            
            if (indices && indices.length > 0) {
                this.visualizer.clearHighlights();
                this.visualizer.highlight(indices, 'comparing');
            }
        }
    }

    executeSwap(step) {
        if (this.visualizer) {
            const indices = step.indices || step.swapped;
            
            if (!indices || indices.length !== 2) {
                console.warn('Invalid swap step - missing or invalid indices/swapped array:', step);
                return;
            }

            if (this.visualizer.animateSwap) {
                this.visualizer.animateSwap(indices[0], indices[1]);
            } else if (this.visualizer.highlight) {
                this.visualizer.clearHighlights();
                this.visualizer.highlight(indices, 'swapping');
                
                if (this.visualizer.render) {
                    this.visualizer.render();
                }
            }
        }
    }

    executeMove(step) {
        if (this.visualizer && this.visualizer.data) {
            const { from, to, value } = step;
            if (value !== undefined) {
                this.visualizer.data[to] = value;
            } else if (from !== undefined) {
                this.visualizer.data[to] = this.visualizer.data[from];
            }
            this.visualizer.render();

            if (this.visualizer.highlight) {
                this.visualizer.clearHighlights();
                this.visualizer.highlight([to], 'current');
            }
        }
    }

    executeMarkSorted(step) {
        if (this.visualizer && this.visualizer.highlight) {
            const indices = step.indices || step.sortedIndices;
            
            if (indices && indices.length > 0) {
                this.visualizer.highlight(indices, 'sorted');
            }
        }
    }

    executeSetPivot(step) {
        if (this.visualizer && this.visualizer.highlight) {
            this.visualizer.highlight([step.index], 'pivot');
        }
    }

    executeVisitNode(step) {
        if (this.visualizer && this.visualizer.highlightNode) {
            this.visualizer.highlightNode(step.nodeId, step.className || 'visiting');
        } else if (this.visualizer && this.visualizer.animateTraversal) {
            this.visualizer.animateTraversal(step.nodeId);
        }
    }

    executeVisitCell(step) {
        if (this.visualizer && this.visualizer.animateVisit) {
            this.visualizer.animateVisit(step.row, step.col);
        } else if (this.visualizer && this.visualizer.grid) {
            this.visualizer.grid[step.row][step.col].isVisited = true;
            this.visualizer.render();
        }
    }

    executeMarkPath(step) {
        if (this.visualizer && this.visualizer.animatePath) {
            this.visualizer.animatePath(step.path);
        } else if (this.visualizer && this.visualizer.grid) {
            step.path.forEach(({ row, col }) => {
                this.visualizer.grid[row][col].isPath = true;
            });
            this.visualizer.render();
        }
    }

    executeCalculateDP(step) {
        if (this.visualizer && this.visualizer.animateCalculation) {
            this.visualizer.animateCalculation(step.row, step.col, step.value);
        } else if (this.visualizer && this.visualizer.setValue) {
            this.visualizer.setValue(step.row, step.col, step.value);
        }
    }

    executePush(step) {
        if (this.visualizer && this.visualizer.updateFromStep) {
            this.visualizer.updateFromStep(step);
        } else if (this.visualizer && this.visualizer.push) {
            this.visualizer.push(step.value || step.pushedValue);
        }
    }

    executePop(step) {
        if (this.visualizer && this.visualizer.updateFromStep) {
            this.visualizer.updateFromStep(step);
        } else if (this.visualizer && this.visualizer.pop) {
            this.visualizer.pop();
        }
    }

    executeEnqueue(step) {
        if (this.visualizer && this.visualizer.updateFromStep) {
            this.visualizer.updateFromStep(step);
        } else if (this.visualizer && this.visualizer.enqueue) {
            this.visualizer.enqueue(step.value || step.enqueuedValue);
        }
    }

    executeDequeue(step) {
        if (this.visualizer && this.visualizer.updateFromStep) {
            this.visualizer.updateFromStep(step);
        } else if (this.visualizer && this.visualizer.dequeue) {
            this.visualizer.dequeue();
        }
    }

    executePeek(step) {
        if (this.visualizer && this.visualizer.updateFromStep) {
            this.visualizer.updateFromStep(step);
        }
        if (this.visualizer && this.visualizer.peek) {
            this.visualizer.peek();
        } else if (this.visualizer && this.visualizer.highlight) {
            // For visualizers that don't have a specific peek method,
            // just highlight the top/front element briefly
            const topIndex = this.visualizer.data ? this.visualizer.data.length - 1 : 0;
            if (topIndex >= 0) {
                this.visualizer.highlight([topIndex], 'current');
            }
        }
    }

    executeFront(step) {
        if (this.visualizer && this.visualizer.updateFromStep) {
            this.visualizer.updateFromStep(step);
        }
        if (this.visualizer && this.visualizer.peek) {
            this.visualizer.peek(); // Front is similar to peek for queue
        }
    }

    executeInsertHead(step) {
        if (this.visualizer && this.visualizer.insert) {
            this.visualizer.insert(step.insertedValue || step.value, 0);
        }
    }

    executeDeleteNode(step) {
        if (this.visualizer && this.visualizer.remove) {
            this.visualizer.remove(step.position || 0);
        }
    }

    executeSearchNode(step) {
        if (this.visualizer && this.visualizer.highlight) {
            this.visualizer.highlight([step.position || 0], 'found');
        }
    }

    executeHashInsert(step) {
        if (this.visualizer && this.visualizer.insert) {
            this.visualizer.insert({ key: step.key, value: step.value });
        }
    }

    executeHashSearch(step) {
        if (this.visualizer && this.visualizer.highlight) {
            // Highlight the bucket where the key would be found
            this.visualizer.highlight([step.bucket || 0], 'found');
        }
    }

    executeHashDelete(step) {
        if (this.visualizer && this.visualizer.remove) {
            this.visualizer.remove(step.position || 0);
        }
    }

    executeClearHighlights(step) {
        if (this.visualizer && this.visualizer.clearHighlights) {
            this.visualizer.clearHighlights();
        }
    }

    executeInit(step) {
        if (this.visualizer && this.visualizer.clearHighlights) {
            this.visualizer.clearHighlights();
        }
        
        // Handle data structure initialization
        if (this.visualizer && this.visualizer.updateFromStep) {
            this.visualizer.updateFromStep(step);
        } else if (this.visualizer && this.visualizer.setData) {
            if (step.array) {
                this.visualizer.setData(step.array);
            } else if (step.stack) {
                this.visualizer.setData(step.stack, 'stack');
            } else if (step.queue) {
                this.visualizer.setData(step.queue, 'queue');
            } else if (step.list) {
                this.visualizer.setData(step.list, 'linked-list');
            } else if (step.hashTable) {
                this.visualizer.setData(step.hashTable, 'hash-table');
            }
        }
    }

    executeComplete(step) {
        console.log('Animation completed');
        this.isPlaying = false;
        this.isPaused = false;
        this.clearTimeout();

        if (this.visualizer && this.visualizer.clearHighlights) {
            this.visualizer.clearHighlights();
        }
        
        // Handle data structure completion
        if (this.visualizer && this.visualizer.updateFromStep) {
            this.visualizer.updateFromStep(step);
        } else if (this.visualizer && this.visualizer.setData) {
            if (step.array) {
                this.visualizer.setData(step.array);
            } else if (step.stack) {
                this.visualizer.setData(step.stack, 'stack');
            } else if (step.queue) {
                this.visualizer.setData(step.queue, 'queue');
            } else if (step.list) {
                this.visualizer.setData(step.list, 'linked-list');
            } else if (step.hashTable) {
                this.visualizer.setData(step.hashTable, 'hash-table');
            }
        }

        if (this.onComplete) {
            this.onComplete();
        }
    }

    executeVisit(step) {
        if (this.visualizer && this.visualizer.highlight) {
            this.visualizer.clearHighlights();
            if (step.comparing) {
                this.visualizer.highlight(step.comparing, 'comparing');
            } else if (step.current !== undefined) {
                this.visualizer.highlight([step.current], 'current');
            } else if (step.currentNode !== undefined) {
                this.visualizer.highlight([step.currentNode], 'current');
            }
        }
    }

    executeExplore(step) {
        if (this.visualizer && this.visualizer.highlight) {
            const indices = [];
            if (step.current !== undefined) indices.push(step.current);
            if (step.neighbor !== undefined) indices.push(step.neighbor);
            if (step.comparing) indices.push(...step.comparing);
            this.visualizer.highlight(indices, 'exploring');
        }
    }

    executeFound(step) {
        if (this.visualizer && this.visualizer.highlight) {
            this.visualizer.clearHighlights();
            if (step.found) {
                this.visualizer.highlight(step.found, 'found');
            } else if (step.current !== undefined) {
                this.visualizer.highlight([step.current], 'found');
            }
        }
    }

    executeNotFound(step) {
        if (this.visualizer && this.visualizer.clearHighlights) {
            this.visualizer.clearHighlights();
        }
    }

    executeSelect(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.selected) {
                this.visualizer.highlight(step.selected, 'selected');
            }
        }
    }

    executeUpdateMin(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.newMin !== undefined) {
                this.visualizer.highlight([step.newMin], 'min');
            }
        }
    }

    executeSorted(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.sortedIndices) {
                this.visualizer.highlight(step.sortedIndices, 'sorted');
            }
        }
    }

    executeDivide(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.range) {
                const indices = [];
                for (let i = step.range[0]; i <= step.range[1]; i++) {
                    indices.push(i);
                }
                this.visualizer.highlight(indices, 'dividing');
            }
        }
    }

    executePlace(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.placed) {
                this.visualizer.highlight(step.placed, 'placed');
            }
        }
    }

    executePivot(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.pivot !== undefined) {
                this.visualizer.highlight([step.pivot], 'pivot');
            }
        }
    }

    executePivotPlace(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.pivotPosition !== undefined) {
                this.visualizer.highlight([step.pivotPosition], 'pivot');
            }
            if (step.swapped) {
                this.visualizer.highlight(step.swapped, 'swapping');
            }
        }
    }

    executeSearchRight(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.newRange) {
                const indices = [];
                for (let i = step.newRange[0]; i <= step.newRange[1]; i++) {
                    indices.push(i);
                }
                this.visualizer.highlight(indices, 'searching');
            }
        }
    }

    executeSearchLeft(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.newRange) {
                const indices = [];
                for (let i = step.newRange[0]; i <= step.newRange[1]; i++) {
                    indices.push(i);
                }
                this.visualizer.highlight(indices, 'searching');
            }
        }
    }

    executeCalculateMid(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.mid !== undefined) {
                this.visualizer.highlight([step.mid], 'mid');
            }
            if (step.range) {
                const indices = [];
                for (let i = step.range[0]; i <= step.range[1]; i++) {
                    indices.push(i);
                }
                this.visualizer.highlight(indices, 'range');
            }
        }
    }

    executeJump(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.current !== undefined) {
                this.visualizer.highlight([step.current], 'jumping');
            }
        }
    }

    executeBlockFound(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.range) {
                const indices = [];
                for (let i = step.range[0]; i <= step.range[1]; i++) {
                    indices.push(i);
                }
                this.visualizer.highlight(indices, 'block');
            }
        }
    }

    executeLinearSearch(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.comparing) {
                this.visualizer.highlight(step.comparing, 'comparing');
            }
        }
    }

    executeInterpolate(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.pos !== undefined) {
                this.visualizer.highlight([step.pos], 'interpolated');
            }
            if (step.range) {
                const indices = [];
                for (let i = step.range[0]; i <= step.range[1]; i++) {
                    indices.push(i);
                }
                this.visualizer.highlight(indices, 'range');
            }
        }
    }

    executeSingleElement(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.comparing) {
                this.visualizer.highlight(step.comparing, 'comparing');
            }
        }
    }

    executeShift(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.shifted) {
                this.visualizer.highlight(step.shifted, 'shifted');
            }
        }
    }

    executeInsert(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.inserted) {
                this.visualizer.highlight(step.inserted, 'inserted');
            }
        }
    }

    executeHeapifyStart(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.node !== undefined) {
                this.visualizer.highlight([step.node], 'heapifying');
            }
        }
    }

    executeUpdateLargest(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.newLargest !== undefined) {
                this.visualizer.highlight([step.newLargest], 'largest');
            }
        }
    }

    executeBuildHeap(step) {
        if (this.visualizer && this.visualizer.clearHighlights) {
            this.visualizer.clearHighlights();
        }
    }

    executeHeapBuilt(step) {
        if (this.visualizer && this.visualizer.clearHighlights) {
            this.visualizer.clearHighlights();
        }
    }

    executeExtract(step) {
        if (this.visualizer && this.visualizer.highlight) {
            if (step.extracted !== undefined) {
                this.visualizer.highlight([step.extracted], 'extracted');
            }
            if (step.swapped) {
                this.visualizer.highlight(step.swapped, 'swapping');
            }
        }
    }

    executeUpdateDistance(step) {
        if (this.visualizer && this.visualizer.animateVisit) {
            this.visualizer.animateVisit(step.node.row, step.node.col);
        }
    }

    executePathFound(step) {
        if (this.visualizer && this.visualizer.animatePath && step.path) {
            this.visualizer.animatePath(step.path);
        }
    }

    executeNoPath(step) {
        // No path found
        // Just update explanation, no visual change needed
    }

    executeUpdateScores(step) {
        if (this.visualizer && this.visualizer.animateVisit) {
            this.visualizer.animateVisit(step.node.row, step.node.col);
        }
    }

    executeTranspose(step) {
        // Transpose graph operation
        // No specific visualization needed
    }

    executeTransposeComplete(step) {
        // Transpose complete
        // No specific visualization needed
    }

    executeFindComponents(step) {
        // Finding components
        // No specific visualization needed
    }

    executeComponentFound(step) {
        if (this.visualizer && this.visualizer.highlightNode) {
            if (step.component) {
                step.component.forEach(nodeId => {
                    this.visualizer.highlightNode(nodeId, 'component');
                });
            }
        }
    }

    executeFillVisit(step) {
        if (this.visualizer && this.visualizer.highlightNode) {
            this.visualizer.highlightNode(step.currentNode, 'visiting');
        }
    }

    executeFillFinish(step) {
        if (this.visualizer && this.visualizer.highlightNode) {
            this.visualizer.highlightNode(step.currentNode, 'finished');
        }
    }

    executeSccVisit(step) {
        if (this.visualizer && this.visualizer.highlightNode) {
            this.visualizer.highlightNode(step.currentNode, 'scc_visiting');
        }
    }

    executeFinish(step) {
        if (this.visualizer && this.visualizer.highlightNode) {
            this.visualizer.highlightNode(step.currentNode, 'finished');
        }
    }

    executeBaseCase(step) {
        // Base case in DP
        // No specific visualization needed for base case
    }

    executeCompute(step) {
        if (this.visualizer && this.visualizer.animateCalculation) {
            this.visualizer.animateCalculation(step.current, 0, step.dp[step.current]);
        }
    }

    executeConsiderItem(step) {
        // Consider item in knapsack
        // No specific visualization needed
    }

    executeCanInclude(step) {
        // Can include item
        // No specific visualization needed
    }

    executeCannotInclude(step) {
        // Cannot include item
        // No specific visualization needed
    }

    executeUpdateDp(step) {
        if (this.visualizer && this.visualizer.setValue) {
            this.visualizer.setValue(step.currentItem, step.currentWeight, step.newValue);
        }
    }

    executeCompareChars(step) {
        // Compare characters in string algorithms
        // No specific visualization needed for character comparison
    }

    executeCharsMatch(step) {
        // Characters match
        // No specific visualization needed
    }

    executeCharsDiffer(step) {
        // Characters differ
        // No specific visualization needed
    }

    executeConsiderAmount(step) {
        // Consider amount in coin change
        // No specific visualization needed
    }

    executeTryCoin(step) {
        // Try coin in coin change
        // No specific visualization needed
    }

    executeEmptyOperation(step) {
        // Handle empty operations (like trying to pop from empty stack)
        if (this.visualizer && this.visualizer.updateFromStep) {
            this.visualizer.updateFromStep(step);
        }
        // No specific visualization needed for empty operations
    }

    executeDataStructureOperation(step) {
        // Handle general data structure operations
        if (this.visualizer && this.visualizer.updateFromStep) {
            this.visualizer.updateFromStep(step);
        }
        
        // Add specific highlighting for certain operations
        if (step.type === 'search_found' || step.type === 'delete_found') {
            if (this.visualizer && this.visualizer.highlight && step.position !== undefined) {
                this.visualizer.highlight([step.position], 'found');
            }
        } else if (step.type === 'search_compare') {
            if (this.visualizer && this.visualizer.highlight && step.position !== undefined) {
                this.visualizer.highlight([step.position], 'comparing');
            }
        }
    }

    replayToCurrentStep() {
        if (this.visualizer && this.visualizer.reset) {
            this.visualizer.reset();
        }

        for (let i = 0; i < this.currentStep; i++) {
            this.executeStep(i);
        }
    }

    notifyStepChange() {
        if (this.onStepChange) {
            this.onStepChange(this.currentStep, this.steps.length);
        }
    }

    // Utility methods for creating common step types
    static createHighlightStep(indices, className = 'current', explanation = '') {
        return {
            type: 'highlight',
            indices: Array.isArray(indices) ? indices : [indices],
            className,
            explanation
        };
    }

    static createCompareStep(index1, index2, explanation = '', stats = null) {
        return {
            type: 'compare',
            indices: [index1, index2],
            explanation,
            stats: stats || { comparisons: 1 }
        };
    }

    static createSwapStep(index1, index2, explanation = '', stats = null) {
        return {
            type: 'swap',
            indices: [index1, index2],
            explanation,
            stats: stats || { swaps: 1 }
        };
    }

    static createMoveStep(from, to, value, explanation = '') {
        return {
            type: 'move',
            from,
            to,
            value,
            explanation
        };
    }

    static createMarkSortedStep(indices, explanation = '') {
        return {
            type: 'mark_sorted',
            indices: Array.isArray(indices) ? indices : [indices],
            explanation
        };
    }

    static createSetPivotStep(index, explanation = '') {
        return {
            type: 'set_pivot',
            index,
            explanation
        };
    }

    static createVisitNodeStep(nodeId, className = 'visiting', explanation = '') {
        return {
            type: 'visit_node',
            nodeId,
            className,
            explanation
        };
    }

    static createVisitCellStep(row, col, explanation = '') {
        return {
            type: 'visit_cell',
            row,
            col,
            explanation
        };
    }

    static createMarkPathStep(path, explanation = '') {
        return {
            type: 'mark_path',
            path,
            explanation
        };
    }

    static createCalculateDPStep(row, col, value, explanation = '') {
        return {
            type: 'calculate_dp',
            row,
            col,
            value,
            explanation
        };
    }

    static createPushStep(value, explanation = '') {
        return {
            type: 'push',
            value,
            explanation
        };
    }

    static createPopStep(explanation = '') {
        return {
            type: 'pop',
            explanation
        };
    }

    static createEnqueueStep(value, explanation = '') {
        return {
            type: 'enqueue',
            value,
            explanation
        };
    }

    static createDequeueStep(explanation = '') {
        return {
            type: 'dequeue',
            explanation
        };
    }

    static createClearHighlightsStep(explanation = '') {
        return {
            type: 'clear_highlights',
            explanation
        };
    }

    clearTimeout() {
        if (this.animationId) {
            clearTimeout(this.animationId);
            this.animationId = null;
        }
    }
}

// Run tests when in development mode
if (window.DSAVisualizer && window.DSAVisualizer.isDevelopment) {
    console.log('Running Animation Controller Tests...');
    AnimationController.runTests();
}

// Animation Step Builder - Fluent interface for creating animation sequences
class AnimationStepBuilder {
    constructor() {
        this.steps = [];
        this.currentStats = { comparisons: 0, swaps: 0, accesses: 0 };
    }

    highlight(indices, className = 'current', explanation = '') {
        this.steps.push(AnimationController.createHighlightStep(indices, className, explanation));
        return this;
    }

    compare(index1, index2, explanation = '') {
        this.currentStats.comparisons++;
        this.steps.push(AnimationController.createCompareStep(
            index1, index2, explanation, { ...this.currentStats }
        ));
        return this;
    }

    swap(index1, index2, explanation = '') {
        this.currentStats.swaps++;
        this.steps.push(AnimationController.createSwapStep(
            index1, index2, explanation, { ...this.currentStats }
        ));
        return this;
    }

    move(from, to, value, explanation = '') {
        this.currentStats.accesses++;
        this.steps.push(AnimationController.createMoveStep(from, to, value, explanation));
        return this;
    }

    markSorted(indices, explanation = '') {
        this.steps.push(AnimationController.createMarkSortedStep(indices, explanation));
        return this;
    }

    setPivot(index, explanation = '') {
        this.steps.push(AnimationController.createSetPivotStep(index, explanation));
        return this;
    }

    visitNode(nodeId, className = 'visiting', explanation = '') {
        this.steps.push(AnimationController.createVisitNodeStep(nodeId, className, explanation));
        return this;
    }

    visitCell(row, col, explanation = '') {
        this.steps.push(AnimationController.createVisitCellStep(row, col, explanation));
        return this;
    }

    markPath(path, explanation = '') {
        this.steps.push(AnimationController.createMarkPathStep(path, explanation));
        return this;
    }

    calculateDP(row, col, value, explanation = '') {
        this.steps.push(AnimationController.createCalculateDPStep(row, col, value, explanation));
        return this;
    }

    push(value, explanation = '') {
        this.steps.push(AnimationController.createPushStep(value, explanation));
        return this;
    }

    pop(explanation = '') {
        this.steps.push(AnimationController.createPopStep(explanation));
        return this;
    }

    enqueue(value, explanation = '') {
        this.steps.push(AnimationController.createEnqueueStep(value, explanation));
        return this;
    }

    dequeue(explanation = '') {
        this.steps.push(AnimationController.createDequeueStep(explanation));
        return this;
    }

    clearHighlights(explanation = '') {
        this.steps.push(AnimationController.createClearHighlightsStep(explanation));
        return this;
    }

    delay(duration = 500, explanation = '') {
        // Add a step that just waits
        this.steps.push({
            type: 'delay',
            duration,
            explanation
        });
        return this;
    }

    build() {
        return this.steps;
    }

    reset() {
        this.steps = [];
        this.currentStats = { comparisons: 0, swaps: 0, accesses: 0 };
        return this;
    }
} 