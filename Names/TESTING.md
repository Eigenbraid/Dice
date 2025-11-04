# Testing Guide

## Setup

Install dependencies:
```bash
npm install
```

## Running Tests

### Run all tests once
```bash
npm test
```

### Run tests in watch mode (re-runs on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## Test Structure

### DataAccess.test.js

Tests for the core data access layer:

- **Constants**: Validates threshold values and defaults
- **SQL Escaping**: Tests SQL injection prevention
- **Query Builders**: Validates SQL query construction
- **Helper Functions**: Tests utility functions
- **Edge Cases**: Handles special characters, empty values, etc.

### Test Coverage

Current coverage includes:
- ✅ Constants validation
- ✅ SQL escaping (injection prevention)
- ✅ Query builder logic (filter combinations)
- ✅ Undersupply detection
- ✅ Edge cases and error handling

### What's Tested

**Pure functions** (no database required):
- `escapeSQL()` - SQL string escaping
- `buildNameViewerQuery()` - Query construction with filters
- `buildSourceStatsQuery()` - Dashboard query generation
- `isUndersupplied()` - Threshold checking logic

**Constants**:
- `THRESHOLD_FIRST_NAMES`
- `THRESHOLD_LAST_NAMES`
- `THRESHOLD_TITLES_FOR_DEFAULT_FALLBACK`
- `DEFAULT_NICKNAME_FREQUENCY`
- `DEFAULT_TITLE_FREQUENCY`

### Future Test Additions

To add database-dependent tests:
1. Create a test database fixture
2. Test `initDatabase()` with real SQL.js
3. Test `getSourceTags()`, `getGenders()`, etc.
4. Test `generateRandomName()` with mock data

## Writing New Tests

Follow this pattern:

```javascript
describe('Feature Name', () => {
    it('should behave correctly in normal case', () => {
        expect(DB.functionName(input)).toBe(expectedOutput);
    });

    it('should handle edge cases', () => {
        expect(DB.functionName(edgeCase)).toBe(expectedOutput);
    });
});
```

## Continuous Integration

These tests can be run in CI pipelines:
```yaml
- run: npm install
- run: npm test
```

## Coverage Goals

Target: 80%+ coverage for DataAccess.js
- Current: Pure functions and query builders covered
- Next: Add database-dependent function tests
