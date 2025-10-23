// CustomRoller.js - Custom dice rolling with text input and validation

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const rollButton = document.getElementById('rollButton');
    const numDiceInput = document.getElementById('numDice');
    const diceTypeInput = document.getElementById('diceType');
    const dropEnabledCheckbox = document.getElementById('dropEnabled');
    const dropTypeSelect = document.getElementById('dropType');
    const dropCountInput = document.getElementById('dropCount');
    const currentResultDiv = document.getElementById('currentResult');
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
     * @returns {Object} - {valid: boolean, numDice: number, diceType: number, dropEnabled: boolean, dropType: string, dropCount: number, error: string}
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
        const dropEnabled = validation.dropEnabled;
        const dropType = validation.dropType;
        const dropCount = validation.dropCount;

        // Roll the dice and get individual results
        const rolls = [];
        for (let i = 0; i < numDice; i++) {
            rolls.push(rollSingleDie(diceType));
        }

        let keptRolls = rolls;
        let droppedRolls = [];
        let total;

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

            // Calculate total from kept rolls only
            total = keptRolls.reduce((sum, roll) => sum + roll, 0);
        } else {
            // Calculate total from all rolls
            total = rolls.reduce((sum, roll) => sum + roll, 0);
        }

        // Update the display
        displayResult(total);

        // Add to history
        addToHistory(numDice, diceType, rolls, keptRolls, droppedRolls, total, dropEnabled, dropType, dropCount);
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
     * Display the current roll result
     * @param {number} total - The total to display
     */
    function displayResult(total) {
        currentResultDiv.textContent = total;
    }

    /**
     * Add a roll to the history log
     * @param {number} numDice - Number of dice rolled
     * @param {number} diceType - Type of dice (number of sides)
     * @param {Array} allRolls - Array of all roll results
     * @param {Array} keptRolls - Array of kept roll results
     * @param {Array} droppedRolls - Array of dropped roll results
     * @param {number} total - Sum of kept rolls
     * @param {boolean} dropEnabled - Whether drop was enabled
     * @param {string} dropType - Type of drop (highest/lowest)
     * @param {number} dropCount - Number of dice dropped
     */
    function addToHistory(numDice, diceType, allRolls, keptRolls, droppedRolls, total, dropEnabled, dropType, dropCount) {
        // Create history entry element
        const entry = document.createElement('div');
        entry.className = 'history-entry';

        if (dropEnabled) {
            // Format: "Rolled 4d6, drop lowest 1: (3, 6, 1, 4) → kept (3, 6, 4) = 13"
            const allRollsString = allRolls.join(', ');
            const keptRollsString = keptRolls.join(', ');
            entry.textContent = `Rolled ${numDice}d${diceType}, drop ${dropType} ${dropCount}: (${allRollsString}) → kept (${keptRollsString}) = ${total}`;
        } else {
            // Format the individual rolls
            const rollsString = allRolls.join(', ');
            // Create the text: "Rolled 3d6 (3, 6, 1) = 10"
            entry.textContent = `Rolled ${numDice}d${diceType} (${rollsString}) = ${total}`;
        }

        // Add to the beginning of history (most recent first)
        rollHistoryDiv.insertBefore(entry, rollHistoryDiv.firstChild);
    }
});
