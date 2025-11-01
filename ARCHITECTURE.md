# Dice Roller - Architecture Documentation

This document describes the architecture, code organization, and development practices for the Dice Roller project.

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

**All pages refactored:**
- ✅ Basic.html - Uses DiceLibrary + HistoryLog
- ✅ Fate.html - Uses Fate + HistoryLog
- ✅ Blades.html - Uses Blades + HistoryLog
- ✅ Tarot.html - Uses Tarot + CardLibrary + HistoryLog
- ✅ Custom.html - Uses DiceLibrary + HistoryLog (refactored from legacy CustomRoller.js)

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

## Deprecated Files

**CustomRoller.js** - Legacy file, no longer used. Custom.html has been refactored to use ES6 modules with DiceLibrary. This file is kept for reference but should not be used in new code.

## File Structure

```
Dice/
├── Core Libraries (Pure Logic)
│   ├── DiceLibrary.js          # Core dice mechanics (pure functions)
│   ├── CardLibrary.js          # Card deck mechanics (pure functions)
│   └── HistoryLog.js           # History display utilities
├── Domain-Specific Modules
│   ├── Fate.js                 # Fate/Fudge dice (uses DiceLibrary)
│   ├── Blades.js               # Blades in the Dark (uses DiceLibrary)
│   └── Tarot.js                # Tarot cards (uses CardLibrary)
├── UI & Theme Management
│   ├── ThemeManager.js         # Theme switching & persistence
│   ├── Snowflakes.js           # Seasonal animations
│   └── Style.css               # All styling & themes
├── HTML Pages (UI Layer)
│   ├── Index.html              # Main landing page
│   ├── Basic.html              # Basic dice roller
│   ├── Fate.html               # Fate/Fudge roller
│   ├── Blades.html             # Blades in the Dark roller
│   ├── Tarot.html              # Tarot card reader
│   └── Custom.html             # Custom dice roller with modifiers
├── Configuration & Build
│   ├── package.json            # NPM config with Vitest
│   ├── vitest.config.js        # Vitest configuration
│   ├── .gitignore              # Git ignore patterns
│   └── server.py               # Local development server
├── Tests
│   ├── DiceLibrary.test.js     # Core dice mechanics tests
│   ├── CardLibrary.test.js     # Card deck tests
│   ├── Fate.test.js            # Fate dice tests
│   ├── Blades.test.js          # Blades dice tests
│   ├── HistoryLog.test.js      # History utilities tests
│   └── Tarot.test.js           # Tarot card tests
├── Documentation
│   ├── README.md               # Project overview & quick start
│   ├── ARCHITECTURE.md         # This file - architecture & development
│   └── CLAUDE.md               # Guide for AI assistants
└── Deprecated
    └── CustomRoller.js         # ⚠️ DEPRECATED - Legacy code, do not use
```

## Notes

- All new JS files use ES6 module syntax (`export`/`import`)
- HTML files use `<script type="module">` for ES6 support
- Tests run in Node.js using Vitest
- No build step required - modules work natively in modern browsers
