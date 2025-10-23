// DiceRoller.js - Reusable dice rolling functionality

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const rollButton = document.getElementById('rollButton');
    const numDiceSelect = document.getElementById('numDice');
    const diceTypeSelect = document.getElementById('diceType');
    const currentResultDiv = document.getElementById('currentResult');
    const rollHistoryDiv = document.getElementById('rollHistory');

    // Add click event listener to roll button
    rollButton.addEventListener('click', rollDice);

    // Also allow rolling with Enter key
    document.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            rollDice();
        }
    });

    /**
     * Main dice rolling function
     */
    function rollDice() {
        // Get current selections
        const numDice = parseInt(numDiceSelect.value);
        const diceType = parseInt(diceTypeSelect.value);

        // Roll the dice and get individual results
        const rolls = [];
        for (let i = 0; i < numDice; i++) {
            rolls.push(rollSingleDie(diceType));
        }

        // Calculate total
        const total = rolls.reduce((sum, roll) => sum + roll, 0);

        // Update the display
        displayResult(total);

        // Add to history
        addToHistory(numDice, diceType, rolls, total);
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
     * @param {Array} rolls - Array of individual roll results
     * @param {number} total - Sum of all rolls
     */
    function addToHistory(numDice, diceType, rolls, total) {
        // Create history entry element
        const entry = document.createElement('div');
        entry.className = 'history-entry';

        // Format the individual rolls
        const rollsString = rolls.join(', ');

        // Create the text: "Rolled 3d6 (3, 6, 1) = 10"
        entry.textContent = `Rolled ${numDice}d${diceType} (${rollsString}) = ${total}`;

        // Add to the beginning of history (most recent first)
        rollHistoryDiv.insertBefore(entry, rollHistoryDiv.firstChild);
    }
});
