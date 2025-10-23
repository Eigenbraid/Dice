// CustomRoller.js - Custom dice rolling with text input and validation

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const rollButton = document.getElementById('rollButton');
    const numDiceInput = document.getElementById('numDice');
    const diceTypeInput = document.getElementById('diceType');
    const rollModeRadios = document.getElementsByName('rollMode');
    const explodingEnabledCheckbox = document.getElementById('explodingEnabled');
    const explodingModeSelect = document.getElementById('explodingMode');
    const successCountEnabledCheckbox = document.getElementById('successCountEnabled');
    const successComparisonSelect = document.getElementById('successComparison');
    const successThresholdInput = document.getElementById('successThreshold');
    const dropEnabledCheckbox = document.getElementById('dropEnabled');
    const dropTypeSelect = document.getElementById('dropType');
    const dropCountInput = document.getElementById('dropCount');
    const successResultDiv = document.getElementById('successResult');
    const sumResultDiv = document.getElementById('sumResult');
    const rollsResultDiv = document.getElementById('rollsResult');
    const rollHistoryDiv = document.getElementById('rollHistory');
    const errorMessageDiv = document.getElementById('errorMessage');

    // Add click event listener to roll button
    rollButton.addEventListener('click', rollDice);

    // Also allow rolling with Enter key
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            rollDice();
        }
    });

    // Clear error message when user starts typing
    numDiceInput.addEventListener('input', clearError);
    diceTypeInput.addEventListener('input', clearError);
    dropCountInput.addEventListener('input', clearError);
    successThresholdInput.addEventListener('input', clearError);

    /**
     * Parse a dice value that might be in various formats
     * @param {string} value - The value to parse (e.g., "20", "d20")
     * @returns {number|null} - Parsed number or null if invalid
     */
    function parseDiceValue(value) {
        // Trim whitespace
        value = value.trim();

        // Check if it's in "dX" format (e.g., "d20")
        const diceMatch = value.match(/^d(\d+)$/i);
        if (diceMatch) {
            return parseInt(diceMatch[1]);
        }

        // Check if it's a plain number
        const numMatch = value.match(/^\d+$/);
        if (numMatch) {
            return parseInt(value);
        }

        return null;
    }

    /**
     * Validate inputs and return parsed values or error message
     * @returns {Object} - {valid: boolean, numDice: number, diceType: number, rollMode: string, explodingEnabled: boolean, explodingMode: string, successCountEnabled: boolean, successComparison: string, successThreshold: number, dropEnabled: boolean, dropType: string, dropCount: number, error: string}
     */
    function validateInputs() {
        const numDiceValue = numDiceInput.value;
        const diceTypeValue = diceTypeInput.value;

        // Parse number of dice
        const numDice = parseDiceValue(numDiceValue);
        if (numDice === null) {
            return {
                valid: false,
                error: `Invalid number of dice: "${numDiceValue}". Please enter a number (e.g., 3) or use dice notation without a number (e.g., d3).`
            };
        }
        if (numDice < 1) {
            return {
                valid: false,
                error: `Number of dice must be at least 1. You entered: ${numDice}.`
            };
        }
        if (numDice > 1000) {
            return {
                valid: false,
                error: `Number of dice is too large (maximum 1000). You entered: ${numDice}.`
            };
        }

        // Parse dice type (number of sides)
        const diceType = parseDiceValue(diceTypeValue);
        if (diceType === null) {
            return {
                valid: false,
                error: `Invalid number of sides: "${diceTypeValue}". Please enter a number (e.g., 20) or dice notation (e.g., d20).`
            };
        }
        if (diceType < 2) {
            return {
                valid: false,
                error: `Number of sides must be at least 2. You entered: ${diceType}.`
            };
        }
        if (diceType > 1000000) {
            return {
                valid: false,
                error: `Number of sides is too large (maximum 1,000,000). You entered: ${diceType}.`
            };
        }

        // Get roll mode
        let rollMode = 'normal';
        for (const radio of rollModeRadios) {
            if (radio.checked) {
                rollMode = radio.value;
                break;
            }
        }

        // Check if exploding dice is enabled
        const explodingEnabled = explodingEnabledCheckbox.checked;
        const explodingMode = explodingModeSelect.value;

        if (explodingEnabled && diceType < 2) {
            return {
                valid: false,
                error: `Exploding dice requires at least 2 sides. You entered: ${diceType}.`
            };
        }

        // Check if success counting is enabled
        const successCountEnabled = successCountEnabledCheckbox.checked;
        const successComparison = successComparisonSelect.value;
        let successThreshold = 0;

        if (successCountEnabled) {
            // Parse success threshold
            successThreshold = parseDiceValue(successThresholdInput.value);
            if (successThreshold === null) {
                return {
                    valid: false,
                    error: `Invalid success threshold: "${successThresholdInput.value}". Please enter a number.`
                };
            }
            if (successThreshold < 1) {
                return {
                    valid: false,
                    error: `Success threshold must be at least 1. You entered: ${successThreshold}.`
                };
            }
        }

        // Check if drop is enabled
        const dropEnabled = dropEnabledCheckbox.checked;
        let dropCount = 0;
        let dropType = 'lowest';

        if (dropEnabled) {
            // Parse drop count
            dropCount = parseDiceValue(dropCountInput.value);
            if (dropCount === null) {
                return {
                    valid: false,
                    error: `Invalid drop count: "${dropCountInput.value}". Please enter a number.`
                };
            }
            if (dropCount < 1) {
                return {
                    valid: false,
                    error: `Drop count must be at least 1. You entered: ${dropCount}.`
                };
            }
            if (dropCount >= numDice) {
                return {
                    valid: false,
                    error: `Drop count (${dropCount}) must be less than the number of dice (${numDice}). You need at least one die remaining after dropping.`
                };
            }

            dropType = dropTypeSelect.value;
        }

        return {
            valid: true,
            numDice: numDice,
            diceType: diceType,
            rollMode: rollMode,
            explodingEnabled: explodingEnabled,
            explodingMode: explodingMode,
            successCountEnabled: successCountEnabled,
            successComparison: successComparison,
            successThreshold: successThreshold,
            dropEnabled: dropEnabled,
            dropType: dropType,
            dropCount: dropCount
        };
    }

    /**
     * Display error message
     * @param {string} message - Error message to display
     */
    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
    }

    /**
     * Clear error message
     */
    function clearError() {
        errorMessageDiv.style.display = 'none';
        errorMessageDiv.textContent = '';
    }

    /**
     * Main dice rolling function
     */
    function rollDice() {
        // Clear any previous error
        clearError();

        // Validate inputs
        const validation = validateInputs();
        if (!validation.valid) {
            showError(validation.error);
            return;
        }

        const numDice = validation.numDice;
        const diceType = validation.diceType;
        const rollMode = validation.rollMode;
        const explodingEnabled = validation.explodingEnabled;
        const explodingMode = validation.explodingMode;
        const successCountEnabled = validation.successCountEnabled;
        const successComparison = validation.successComparison;
        const successThreshold = validation.successThreshold;
        const dropEnabled = validation.dropEnabled;
        const dropType = validation.dropType;
        const dropCount = validation.dropCount;

        // Perform the roll(s)
        if (rollMode === 'advantage' || rollMode === 'disadvantage') {
            // Roll twice
            const result1 = performSingleRoll(numDice, diceType, explodingEnabled, explodingMode, dropEnabled, dropType, dropCount, successCountEnabled, successComparison, successThreshold);
            const result2 = performSingleRoll(numDice, diceType, explodingEnabled, explodingMode, dropEnabled, dropType, dropCount, successCountEnabled, successComparison, successThreshold);

            // Choose which result to use based on roll mode
            let chosenResult, otherResult;
            if (rollMode === 'advantage') {
                // Choose higher result (based on success count if enabled, otherwise sum)
                if (successCountEnabled) {
                    if (result1.successCount >= result2.successCount) {
                        chosenResult = result1;
                        otherResult = result2;
                    } else {
                        chosenResult = result2;
                        otherResult = result1;
                    }
                } else {
                    if (result1.total >= result2.total) {
                        chosenResult = result1;
                        otherResult = result2;
                    } else {
                        chosenResult = result2;
                        otherResult = result1;
                    }
                }
            } else { // disadvantage
                // Choose lower result (based on success count if enabled, otherwise sum)
                if (successCountEnabled) {
                    if (result1.successCount <= result2.successCount) {
                        chosenResult = result1;
                        otherResult = result2;
                    } else {
                        chosenResult = result2;
                        otherResult = result1;
                    }
                } else {
                    if (result1.total <= result2.total) {
                        chosenResult = result1;
                        otherResult = result2;
                    } else {
                        chosenResult = result2;
                        otherResult = result1;
                    }
                }
            }

            // Update the display
            displayResult(chosenResult, successCountEnabled);

            // Add to history with both rolls
            addToHistory(numDice, diceType, chosenResult, otherResult, rollMode, explodingEnabled, successCountEnabled, successComparison, successThreshold, dropEnabled, dropType, dropCount);
        } else {
            // Normal roll - just once
            const result = performSingleRoll(numDice, diceType, explodingEnabled, explodingMode, dropEnabled, dropType, dropCount, successCountEnabled, successComparison, successThreshold);

            // Update the display
            displayResult(result, successCountEnabled);

            // Add to history
            addToHistory(numDice, diceType, result, null, rollMode, explodingEnabled, successCountEnabled, successComparison, successThreshold, dropEnabled, dropType, dropCount);
        }
    }

    /**
     * Perform a single roll with all modifiers
     * @returns {Object} - {rolls: Array, keptRolls: Array, droppedRolls: Array, total: number, successCount: number}
     */
    function performSingleRoll(numDice, diceType, explodingEnabled, explodingMode, dropEnabled, dropType, dropCount, successCountEnabled, successComparison, successThreshold) {
        // Roll the dice with exploding if enabled
        const rolls = [];
        for (let i = 0; i < numDice; i++) {
            if (explodingEnabled) {
                rolls.push(rollExplodingDie(diceType, explodingMode));
            } else {
                rolls.push(rollSingleDie(diceType));
            }
        }

        let keptRolls = rolls;
        let droppedRolls = [];

        if (dropEnabled) {
            // Create array of {value, index} to track which rolls are which
            const indexedRolls = rolls.map((value, index) => ({value, index}));

            // Sort based on drop type
            if (dropType === 'lowest') {
                indexedRolls.sort((a, b) => a.value - b.value);
            } else {
                indexedRolls.sort((a, b) => b.value - a.value);
            }

            // Split into dropped and kept
            const droppedIndexed = indexedRolls.slice(0, dropCount);
            const keptIndexed = indexedRolls.slice(dropCount);

            // Extract values
            droppedRolls = droppedIndexed.map(r => r.value);
            keptRolls = keptIndexed.map(r => r.value);
        }

        // Calculate total from kept rolls
        const total = keptRolls.reduce((sum, roll) => sum + roll, 0);

        // Calculate success count if enabled
        let successCount = 0;
        if (successCountEnabled) {
            for (const roll of keptRolls) {
                if (successComparison === 'atleast' && roll >= successThreshold) {
                    successCount++;
                } else if (successComparison === 'exactly' && roll === successThreshold) {
                    successCount++;
                } else if (successComparison === 'atmost' && roll <= successThreshold) {
                    successCount++;
                }
            }
        }

        return {
            rolls: rolls,
            keptRolls: keptRolls,
            droppedRolls: droppedRolls,
            total: total,
            successCount: successCount
        };
    }

    /**
     * Roll a single die
     * @param {number} sides - Number of sides on the die
     * @returns {number} - Random number between 1 and sides (inclusive)
     */
    function rollSingleDie(sides) {
        return Math.floor(Math.random() * sides) + 1;
    }

    /**
     * Roll an exploding die
     * @param {number} sides - Number of sides on the die
     * @param {string} mode - 'unlimited' or 'once'
     * @returns {number} - Total value (including explosions)
     */
    function rollExplodingDie(sides, mode) {
        let firstRoll = rollSingleDie(sides);
        let total = firstRoll;

        if (mode === 'once') {
            // Only explode once
            if (firstRoll === sides) {
                total += rollSingleDie(sides);
            }
        } else { // unlimited
            // Keep exploding while last roll was max
            let lastRoll = firstRoll;
            while (lastRoll === sides) {
                lastRoll = rollSingleDie(sides);
                total += lastRoll;
            }
        }

        return total;
    }

    /**
     * Display the current roll result
     * @param {Object} result - The result object to display
     * @param {boolean} successCountEnabled - Whether success counting is enabled
     */
    function displayResult(result, successCountEnabled) {
        // Show success count if enabled
        if (successCountEnabled) {
            successResultDiv.textContent = `${result.successCount} successes`;
            successResultDiv.style.display = 'block';
        } else {
            successResultDiv.style.display = 'none';
        }

        // Always show sum
        sumResultDiv.textContent = result.total;

        // Show individual rolls
        rollsResultDiv.textContent = `[${result.rolls.join(', ')}]`;
        rollsResultDiv.style.display = 'block';
    }

    /**
     * Add a roll to the history log
     * @param {number} numDice - Number of dice rolled
     * @param {number} diceType - Type of dice (number of sides)
     * @param {Object} chosenResult - The result that was chosen (or only result for normal rolls)
     * @param {Object|null} otherResult - The other result for advantage/disadvantage (null for normal)
     * @param {string} rollMode - 'normal', 'advantage', or 'disadvantage'
     * @param {boolean} explodingEnabled - Whether exploding was enabled
     * @param {boolean} successCountEnabled - Whether success counting was enabled
     * @param {string} successComparison - Type of comparison for success counting
     * @param {number} successThreshold - Threshold for success counting
     * @param {boolean} dropEnabled - Whether drop was enabled
     * @param {string} dropType - Type of drop (highest/lowest)
     * @param {number} dropCount - Number of dice dropped
     */
    function addToHistory(numDice, diceType, chosenResult, otherResult, rollMode, explodingEnabled, successCountEnabled, successComparison, successThreshold, dropEnabled, dropType, dropCount) {
        // Create history entry element
        const entry = document.createElement('div');
        entry.className = 'history-entry';

        // Build the configuration lines
        const configLines = [];

        // Main roll description
        configLines.push(`Roll ${numDice} dice with ${diceType} sides`);

        // Add mode if not normal
        if (rollMode === 'advantage') {
            configLines.push('Advantage');
        } else if (rollMode === 'disadvantage') {
            configLines.push('Disadvantage');
        }

        // Add drop info
        if (dropEnabled) {
            configLines.push(`Drop ${dropCount} ${dropType}`);
        }

        // Add exploding info
        if (explodingEnabled) {
            configLines.push('Exploding');
        }

        // Add success counting info
        if (successCountEnabled) {
            const comparisonText = successComparison === 'atleast' ? 'at least' :
                                  successComparison === 'exactly' ? 'exactly' : 'at most';
            configLines.push(`Success Count (${comparisonText} ${successThreshold})`);
        }

        // Create config section
        const configDiv = document.createElement('div');
        configDiv.style.marginBottom = '0.3em';
        configDiv.textContent = configLines.join('\n');

        entry.appendChild(configDiv);

        // Helper function to format a single result
        function formatResult(result) {
            const details = document.createElement('div');
            details.style.fontSize = '0.9em';
            details.style.marginLeft = '1em';
            details.style.color = '#666';

            let lines = [];

            // Show individual rolls
            lines.push(`Rolls: [${result.rolls.join(', ')}]`);

            // Show dropped rolls if applicable
            if (dropEnabled && result.droppedRolls.length > 0) {
                lines.push(`Dropped: [${result.droppedRolls.join(', ')}]`);
            }

            // Show success count first (on its own line)
            if (successCountEnabled) {
                lines.push(`${result.successCount} successes`);
            }

            // Then show sum
            lines.push(`Sum: ${result.total}`);

            details.textContent = lines.join('\n');
            return details;
        }

        // Show both rolls if advantage/disadvantage
        if (otherResult) {
            const chosenLabel = document.createElement('div');
            chosenLabel.style.marginTop = '0.3em';
            chosenLabel.style.fontWeight = 'bold';
            chosenLabel.textContent = '→ Chosen:';
            entry.appendChild(chosenLabel);
            entry.appendChild(formatResult(chosenResult));

            const otherLabel = document.createElement('div');
            otherLabel.style.marginTop = '0.5em';
            otherLabel.style.fontWeight = 'normal';
            otherLabel.textContent = '  Other:';
            entry.appendChild(otherLabel);
            entry.appendChild(formatResult(otherResult));
        } else {
            // Just show the one result
            entry.appendChild(formatResult(chosenResult));
        }

        // Add to the beginning of history (most recent first)
        rollHistoryDiv.insertBefore(entry, rollHistoryDiv.firstChild);
    }
});
