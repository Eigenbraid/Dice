# ES6 Module Refactoring

This project has been refactored to use ES6 modules with proper separation of concerns.

## Architecture

### Core Modules (Pure Logic - No DOM)

- **DiceLibrary.js** - Core dice rolling logic
  - rollSingleDie(), rollDice(), rollExploding(), dropDice(), countSuccesses()
  - Pure functions, fully testable

- **CardLibrary.js** - Generic card deck mechanics
  - createDeck(), shuffleDeck(), drawCard(), dealHands()
  - Works for any card game

- **HistoryLog.js** - Generic history display utilities
  - createHistoryEntry(), addToHistory(), clearHistory()
  - Reusable across all pages

### Domain-Specific Modules

- **Fate.js** - Fate/Fudge dice system
  - rollFateDice(), formatFateTotal(), getFateSymbol()
  - Uses DiceLibrary for core mechanics

- **Blades.js** - Blades in the Dark dice system
  - rollBladesDice(), getOutcome(), getOutcomeColor()
  - Uses DiceLibrary for core mechanics

- **Tarot.js** - Tarot card readings
  - performThreeCardSpread(), formatTarotCard(), getCardImagePath()
  - Uses CardLibrary for deck mechanics
  - Contains full 78-card deck data

### HTML Files (UI Layer)

All HTML files now use `<script type="module">` with inline code that:
1. Imports from pure logic modules
2. Gets values from UI inputs
3. Calls pure functions
4. Updates DOM with results

**Refactored:**
- ✅ Basic.html - Uses DiceLibrary + HistoryLog
- ✅ Fate.html - Uses Fate + HistoryLog
- ✅ Blades.html - Uses Blades + HistoryLog
- ✅ Tarot.html - Uses Tarot + CardLibrary + HistoryLog

**Not Yet Refactored:**
- ⚠️ Custom.html - Still uses CustomRoller.js (769 lines - needs separate refactoring task)

## Benefits

1. **Separation of Concerns**
   - Logic layer: Pure functions with no DOM dependencies
   - UI layer: DOM manipulation only
   - No mixing of concerns

2. **Testability**
   - All logic modules can be imported and tested in Node.js
   - See tests/DiceLibrary.test.js for examples
   - Run tests with: `npm test`

3. **Reusability**
   - HistoryLog.js used by all pages
   - DiceLibrary.js used by Fate, Blades, and could be used by Custom
   - CardLibrary.js can support future card games

4. **Maintainability**
   - Clear module boundaries
   - No code duplication
   - Easy to add new features

## Running Tests

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Adding New Modules

To add a new dice system or card game:

1. Create a new module file (e.g., `MyGame.js`)
2. Import from DiceLibrary or CardLibrary for basic mechanics
3. Export domain-specific functions
4. Create HTML file that imports your module + HistoryLog
5. Write tests in `tests/MyGame.test.js`

## Migration Path for Custom.html

Custom.html still needs refactoring. Suggested approach:

1. Extract pure logic from CustomRoller.js to use DiceLibrary
2. Move exploding dice logic to DiceLibrary.rollExploding()
3. Move success counting to DiceLibrary.countSuccesses()
4. Move drop dice logic to DiceLibrary.dropDice()
5. Keep UI-specific formatting in inline script
6. Use HistoryLog for history management

## File Structure

```
Dice/
├── DiceLibrary.js          # Core dice mechanics (pure)
├── CardLibrary.js          # Card deck mechanics (pure)
├── HistoryLog.js           # History display utilities (pure DOM)
├── Fate.js                 # Fate dice (uses DiceLibrary)
├── Blades.js               # Blades dice (uses DiceLibrary)
├── Tarot.js                # Tarot cards (uses CardLibrary)
├── CustomRoller.js         # ⚠️ Legacy - needs refactoring
├── Basic.html              # ✅ Refactored - ES6 modules
├── Fate.html               # ✅ Refactored - ES6 modules
├── Blades.html             # ✅ Refactored - ES6 modules
├── Tarot.html              # ✅ Refactored - ES6 modules
├── Custom.html             # ⚠️ Still uses CustomRoller.js
├── package.json            # NPM config with Vitest
└── tests/
    └── DiceLibrary.test.js # Example test file
```

## Notes

- All new JS files use ES6 module syntax (`export`/`import`)
- HTML files use `<script type="module">` for ES6 support
- Tests run in Node.js using Vitest
- No build step required - modules work natively in modern browsers
