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
    const discardedResultDiv = document.getElementById('discardedResult');
    const rollHistoryDiv = document.getElementById('rollHistory');
    const errorMessageDiv = document.getElementById('errorMessage');
    const shareButton = document.getElementById('shareButton');
    const shareMessageDiv = document.getElementById('shareMessage');

    // Parse URL parameters on page load
    loadConfigurationFromURL();

    // Add click event listener to roll button
    rollButton.addEventListener('click', rollDice);

    // Also allow rolling with Enter key
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            rollDice();
        }
    });

    // Add click event listener to share button
    shareButton.addEventListener('click', shareConfiguration);

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
     * Load configuration from URL parameters
     */
    function loadConfigurationFromURL() {
        const urlParams = new URLSearchParams(window.location.search);

        // Set number of dice
        if (urlParams.has('Number')) {
            numDiceInput.value = urlParams.get('Number');
        }

        // Set number of sides
        if (urlParams.has('Sides')) {
            diceTypeInput.value = urlParams.get('Sides');
        }

        // Set roll mode
        if (urlParams.has('Advantage')) {
            document.querySelector('input[name="rollMode"][value="advantage"]').checked = true;
        } else if (urlParams.has('Disadvantage')) {
            document.querySelector('input[name="rollMode"][value="disadvantage"]').checked = true;
        }

        // Set exploding dice
        if (urlParams.has('Exploding')) {
            explodingEnabledCheckbox.checked = true;
            explodingModeSelect.value = 'unlimited';
        } else if (urlParams.has('ExplodingOnce')) {
            explodingEnabledCheckbox.checked = true;
            explodingModeSelect.value = 'once';
        }

        // Set drop dice
        if (urlParams.has('DropLowest')) {
            dropEnabledCheckbox.checked = true;
            dropTypeSelect.value = 'lowest';
            dropCountInput.value = urlParams.get('DropLowest');
        } else if (urlParams.has('DropHighest')) {
            dropEnabledCheckbox.checked = true;
            dropTypeSelect.value = 'highest';
            dropCountInput.value = urlParams.get('DropHighest');
        }

        // Set success counting
        if (urlParams.has('CountAtLeast')) {
            successCountEnabledCheckbox.checked = true;
            successComparisonSelect.value = 'atleast';
            successThresholdInput.value = urlParams.get('CountAtLeast');
        } else if (urlParams.has('CountExactly')) {
            successCountEnabledCheckbox.checked = true;
            successComparisonSelect.value = 'exactly';
            successThresholdInput.value = urlParams.get('CountExactly');
        } else if (urlParams.has('CountAtMost')) {
            successCountEnabledCheckbox.checked = true;
            successComparisonSelect.value = 'atmost';
            successThresholdInput.value = urlParams.get('CountAtMost');
        }
    }

    /**
     * Generate shareable URL from current configuration
     */
    function shareConfiguration() {
        const params = new URLSearchParams();

        // Add number of dice
        const numDice = numDiceInput.value.trim();
        if (numDice) {
            params.append('Number', numDice);
        }

        // Add number of sides
        const sides = diceTypeInput.value.trim();
        if (sides) {
            params.append('Sides', sides);
        }

        // Add roll mode (only if not normal)
        const rollMode = document.querySelector('input[name="rollMode"]:checked').value;
        if (rollMode === 'advantage') {
            params.append('Advantage', '');
        } else if (rollMode === 'disadvantage') {
            params.append('Disadvantage', '');
        }

        // Add exploding dice
        if (explodingEnabledCheckbox.checked) {
            if (explodingModeSelect.value === 'once') {
                params.append('ExplodingOnce', '');
            } else {
                params.append('Exploding', '');
            }
        }

        // Add drop dice
        if (dropEnabledCheckbox.checked) {
            const dropCount = dropCountInput.value.trim();
            if (dropTypeSelect.value === 'lowest') {
                params.append('DropLowest', dropCount);
            } else {
                params.append('DropHighest', dropCount);
            }
        }

        // Add success counting
        if (successCountEnabledCheckbox.checked) {
            const threshold = successThresholdInput.value.trim();
            const comparison = successComparisonSelect.value;
            if (comparison === 'atleast') {
                params.append('CountAtLeast', threshold);
            } else if (comparison === 'exactly') {
                params.append('CountExactly', threshold);
            } else if (comparison === 'atmost') {
                params.append('CountAtMost', threshold);
            }
        }

        // Generate full URL
        const baseUrl = window.location.origin + window.location.pathname;
        const shareUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            // Show success message
            shareMessageDiv.textContent = 'Configuration URL copied to clipboard!';
            shareMessageDiv.style.display = 'block';

            // Hide message after 3 seconds
            setTimeout(() => {
                shareMessageDiv.style.display = 'none';
            }, 3000);
        }).catch(err => {
            // Fallback: show the URL in an alert if clipboard fails
            alert('Share this URL: ' + shareUrl);
        });
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
            displayResult(chosenResult, successCountEnabled, successThreshold, successComparison, dropEnabled, otherResult);

            // Add to history with both rolls
            addToHistory(numDice, diceType, chosenResult, otherResult, rollMode, explodingEnabled, successCountEnabled, successComparison, successThreshold, dropEnabled, dropType, dropCount);
        } else {
            // Normal roll - just once
            const result = performSingleRoll(numDice, diceType, explodingEnabled, explodingMode, dropEnabled, dropType, dropCount, successCountEnabled, successComparison, successThreshold);

            // Update the display
            displayResult(result, successCountEnabled, successThreshold, successComparison, dropEnabled, null);

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
                // Wrap regular roll in same structure as exploding
                const value = rollSingleDie(diceType);
                rolls.push({
                    value: value,
                    display: String(value),
                    breakdown: [value]
                });
            }
        }

        let keptRolls = rolls;
        let droppedRolls = [];

        if (dropEnabled) {
            // Create array of {roll, value, index} to track which rolls are which
            const indexedRolls = rolls.map((roll, index) => ({roll: roll, value: roll.value, index}));

            // Sort based on drop type
            if (dropType === 'lowest') {
                indexedRolls.sort((a, b) => a.value - b.value);
            } else {
                indexedRolls.sort((a, b) => b.value - a.value);
            }

            // Split into dropped and kept
            const droppedIndexed = indexedRolls.slice(0, dropCount);
            const keptIndexed = indexedRolls.slice(dropCount);

            // Extract roll objects
            droppedRolls = droppedIndexed.map(r => r.roll);
            keptRolls = keptIndexed.map(r => r.roll);
        }

        // Calculate total from kept rolls
        const total = keptRolls.reduce((sum, roll) => sum + roll.value, 0);

        // Calculate success count if enabled
        let successCount = 0;
        if (successCountEnabled) {
            for (const roll of keptRolls) {
                if (successComparison === 'atleast' && roll.value >= successThreshold) {
                    successCount++;
                } else if (successComparison === 'exactly' && roll.value === successThreshold) {
                    successCount++;
                } else if (successComparison === 'atmost' && roll.value <= successThreshold) {
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
     * @returns {Object} - {value: total, display: string, breakdown: array}
     */
    function rollExplodingDie(sides, mode) {
        let breakdown = [];
        let firstRoll = rollSingleDie(sides);
        breakdown.push(firstRoll);
        let total = firstRoll;

        if (mode === 'once') {
            // Only explode once
            if (firstRoll === sides) {
                const nextRoll = rollSingleDie(sides);
                breakdown.push(nextRoll);
                total += nextRoll;
            }
        } else { // unlimited
            // Keep exploding while last roll was max
            let lastRoll = firstRoll;
            while (lastRoll === sides) {
                lastRoll = rollSingleDie(sides);
                breakdown.push(lastRoll);
                total += lastRoll;
            }
        }

        return {
            value: total,
            display: breakdown.join('+'),
            breakdown: breakdown
        };
    }

    /**
     * Display the current roll result
     * @param {Object} result - The result object to display
     * @param {boolean} successCountEnabled - Whether success counting is enabled
     * @param {number} successThreshold - Threshold for success counting
     * @param {string} successComparison - Comparison type for success counting
     * @param {boolean} dropEnabled - Whether drop is enabled
     * @param {Object|null} otherResult - The discarded result (for advantage/disadvantage)
     */
    function displayResult(result, successCountEnabled, successThreshold, successComparison, dropEnabled, otherResult) {
        // Show success count if enabled
        if (successCountEnabled) {
            successResultDiv.textContent = `Successes: ${result.successCount}`;
            successResultDiv.style.display = 'block';
        } else {
            successResultDiv.style.display = 'none';
        }

        // Always show sum with label
        sumResultDiv.textContent = `Sum: ${result.total}`;

        // Build dice display with success highlighting
        let diceText = 'Dice: ';

        if (successCountEnabled) {
            // Create HTML to bold successful dice
            const diceElements = result.rolls.map(roll => {
                const isSuccess = checkSuccess(roll, successThreshold, successComparison);
                return isSuccess ? `<b>${roll.display}</b>` : roll.display;
            });
            diceText += `[${diceElements.join(', ')}]`;
        } else {
            diceText += `[${result.rolls.map(r => r.display).join(', ')}]`;
        }

        // Add drop info if applicable
        if (dropEnabled && result.droppedRolls.length > 0) {
            diceText += `<br>→ keep [${result.keptRolls.map(r => r.display).join(', ')}]`;
        }

        rollsResultDiv.innerHTML = diceText;
        rollsResultDiv.style.display = 'block';

        // Show discarded roll if advantage/disadvantage
        if (otherResult) {
            let discardedText = 'Discarded: ';

            if (successCountEnabled) {
                // Create HTML to bold successful dice
                const diceElements = otherResult.rolls.map(roll => {
                    const isSuccess = checkSuccess(roll, successThreshold, successComparison);
                    return isSuccess ? `<b>${roll.display}</b>` : roll.display;
                });
                discardedText += `[${diceElements.join(', ')}]`;
            } else {
                discardedText += `[${otherResult.rolls.map(r => r.display).join(', ')}]`;
            }

            // Add drop info if applicable
            if (dropEnabled && otherResult.droppedRolls.length > 0) {
                discardedText += `<br>→ keep [${otherResult.keptRolls.map(r => r.display).join(', ')}]`;
            }

            discardedResultDiv.innerHTML = discardedText;
            discardedResultDiv.style.display = 'block';
        } else {
            discardedResultDiv.style.display = 'none';
        }
    }

    /**
     * Check if a roll is a success
     * @param {Object} roll - The roll object with value property
     * @param {number} threshold - Success threshold
     * @param {string} comparison - Comparison type
     * @returns {boolean} - Whether the roll is a success
     */
    function checkSuccess(roll, threshold, comparison) {
        const value = roll.value;
        if (comparison === 'atleast') {
            return value >= threshold;
        } else if (comparison === 'exactly') {
            return value === threshold;
        } else { // atmost
            return value <= threshold;
        }
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

        // Build the configuration as comma-separated list
        const configParts = [];

        // Main roll description
        configParts.push(`Rolling ${numDice}d${diceType}`);

        // Add mode if not normal
        if (rollMode === 'advantage') {
            configParts.push('Advantage');
        } else if (rollMode === 'disadvantage') {
            configParts.push('Disadvantage');
        }

        // Add drop info
        if (dropEnabled) {
            configParts.push(`Drop ${dropCount} ${dropType}`);
        }

        // Add exploding info
        if (explodingEnabled) {
            configParts.push('Exploding');
        }

        // Add success counting info
        if (successCountEnabled) {
            const comparisonText = successComparison === 'atleast' ? 'at least' :
                                  successComparison === 'exactly' ? 'exactly' : 'at most';
            configParts.push(`Success Count (${comparisonText} ${successThreshold})`);
        }

        // Create config section
        const configDiv = document.createElement('div');
        configDiv.style.marginBottom = '0.3em';
        configDiv.textContent = configParts.join(', ');

        entry.appendChild(configDiv);

        // Helper function to format a single result
        function formatResult(result) {
            const details = document.createElement('div');
            details.style.fontSize = '0.9em';
            details.style.marginLeft = '1em';
            details.style.color = '#666';

            let lines = [];

            // Show individual rolls
            lines.push(`Rolls: [${result.rolls.map(r => r.display).join(', ')}]`);

            // Show dropped rolls if applicable
            if (dropEnabled && result.droppedRolls.length > 0) {
                lines.push(`Dropped: [${result.droppedRolls.map(r => r.display).join(', ')}]`);
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
