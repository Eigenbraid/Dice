# NameGenerator - AI Assistant Guide

## Project Overview

**Type**: Web-facing RPG name generator application
**Tech Stack**: JavaScript (SQL.js), Python (SQLite), HTML/CSS
**Status**: Production (deployed at oddturnip.com)
**Security Level**: ⚠️ **HIGH** - This is publicly accessible on the web

## Critical Security Information

### ⚠️ THIS APPLICATION IS WEB-FACING

Unlike other projects in this repository, **NameGenerator is deployed to the public internet**. Security vulnerabilities here could:
- Allow attackers to corrupt the database
- Enable data exfiltration
- Compromise the hosting environment
- Affect real users

**Always use secure coding practices when modifying this project.**

## Security Best Practices

### 1. SQL Injection Prevention

**✅ CORRECT** - Use parameterized queries:
```javascript
const sql = "SELECT * FROM names WHERE position = ? AND gender IN (?, ?)";
const results = DB.execParams(sql, ['first', 'male', 'female']);
```

**❌ INCORRECT** - Never use string concatenation:
```javascript
// DANGEROUS - DO NOT DO THIS
const query = `SELECT * FROM names WHERE position = '${position}'`;
const results = db.exec(query);
```

### 2. API Functions - Security Status

| Function | Status | Notes |
|----------|--------|-------|
| `execParams()` | ✅ Secure | **Use this for all new code** |
| `getTagIdsForSources()` | ✅ Secure | Uses parameterized queries |
| `getWeightedName()` | ✅ Secure | Uses parameterized queries |
| `countNames()` | ✅ Secure | Uses parameterized queries |
| `countNamesIncludingChildren()` | ✅ Secure | Uses parameterized queries |
| `buildNameViewerQuery()` | ⚠️ Legacy | Uses `escapeSQL()` - only safe with trusted dropdown values |
| `escapeSQL()` | ❌ Deprecated | **Do not use in new code** |

### 3. Input Validation

All user-controllable inputs must be validated:
- Gender selections (from dropdown)
- Source selections (from dropdown)
- Position selections (from dropdown)
- Nickname/title frequency sliders

**Current risk level**: LOW - All inputs come from controlled dropdowns populated from database values, not arbitrary text input.

**Future risk**: If adding text search or custom input fields, implement strict validation.

### 4. Refactoring Needed

The `buildNameViewerQuery()` function still uses string interpolation:
```javascript
// viewer.html line 241 - uses this function
const query = DB.buildNameViewerQuery({
    position: positionFilter,  // From <select> dropdown
    gender: genderFilter,      // From <select> dropdown
    source: sourceFilter       // From <select> dropdown
});
```

**Current safety**: These values come from `<select>` elements populated from database queries, so risk is mitigated.

**Recommendation for future**: Refactor to use parameterized queries:
```javascript
// New secure approach
const results = DB.getFilteredNames({
    position: positionFilter,
    gender: genderFilter,
    source: sourceFilter
});
```

## File Structure

```
NameGenerator/
├── DataAccess.js          # Core database API (secure)
├── DataAccess.test.js     # Unit tests
├── create_database.py     # Database schema creation
├── import_names_from_csv.py  # Data import (uses parameterized queries)
├── export_names_to_csv.py    # Data export
├── clean_csv.py           # CSV cleaning utility
├── index.html             # Main name generator UI
├── random.html            # Random name generator
├── viewer.html            # Database viewer (⚠️ uses buildNameViewerQuery)
├── dashboard.html         # Statistics dashboard
├── names.db               # SQLite database (225KB)
└── names.csv              # Source data
```

## Before Making Changes

1. **Read the security section above** - This is non-negotiable for web-facing apps
2. **Run existing tests**: `npm test` to ensure nothing breaks
3. **Check for SQL injection**: Search for template literals with `${` in SQL strings
4. **Validate inputs**: All user-controllable data must be validated
5. **Test locally first**: Never push untested code to production

## Testing

### Run Unit Tests
```bash
npm test
```

### Test Coverage
- ✅ `execParams()` - Not yet tested (added recently)
- ✅ `escapeSQL()` - Comprehensive tests (deprecated but kept for compatibility)
- ✅ `buildNameViewerQuery()` - Tests exist
- ✅ `getWeightedName()` - Not directly tested (uses database)
- ✅ `countNames()` - Not directly tested (uses database)

### Integration Testing Needed
Currently missing:
- End-to-end tests with actual database
- XSS vulnerability testing
- Input validation boundary tests

## Common Tasks

### Adding New Name Data
```bash
# 1. Add names to names.csv with proper format:
# Name,Position,Gender,Weight,Source,Vibe,Theme
# Example: "Aria",first,female,1.0,"Blades 68","","Elegant"

# 2. Import CSV (uses secure parameterized queries)
python import_names_from_csv.py names.csv

# 3. Verify import
python -c "import sqlite3; conn = sqlite3.connect('names.db'); print(conn.execute('SELECT COUNT(*) FROM names').fetchone())"
```

### Adding New Source Tags
```bash
# Edit create_database.py, add to sources list (line 168-183):
sources = [
    'Blades 68',
    'Your New Source',  # Add here
    ...
]

# Recreate database
python create_database.py
python import_names_from_csv.py names.csv
```

### Modifying Database Schema
```bash
# 1. Update create_database.py with new schema
# 2. Backup existing database
cp names.db names.db.backup

# 3. Recreate database
python create_database.py
python import_names_from_csv.py names.csv

# 4. Test thoroughly before deploying
```

## Deployment Checklist

Before pushing to production:

- [ ] All tests pass (`npm test`)
- [ ] No SQL injection vulnerabilities introduced
- [ ] Input validation present for any new user inputs
- [ ] No console.log() or debug code left in
- [ ] Database file size reasonable (<1MB)
- [ ] Tested in multiple browsers
- [ ] No hardcoded URLs or paths (use relative paths)
- [ ] CSP headers configured on server (if applicable)

## Known Issues / Technical Debt

### 1. `buildNameViewerQuery()` Not Fully Secured
**Issue**: Uses `escapeSQL()` instead of parameterized queries
**Risk Level**: LOW (inputs from controlled dropdowns)
**Fix**: Refactor to return results instead of query string
**Priority**: Medium

### 2. No Pagination in Database Viewer
**Issue**: Loads all names at once in viewer.html
**Risk Level**: LOW (performance issue, not security)
**Impact**: With 10,000+ names, browser freezes
**Priority**: Low

### 3. No Rate Limiting
**Issue**: No protection against automated abuse
**Risk Level**: LOW (simple name generator, not worth attacking)
**Fix**: Implement server-side rate limiting if traffic increases
**Priority**: Low

## Emergency Procedures

### If Database Gets Corrupted
```bash
# Restore from git
git checkout names.db

# Or rebuild from source
python create_database.py
python import_names_from_csv.py names.csv
```

### If SQL Injection Discovered
1. **Immediately** take site offline or disable affected feature
2. Review server logs for suspicious queries
3. Check database integrity: `sqlite3 names.db "PRAGMA integrity_check;"`
4. Fix vulnerability using `execParams()`
5. Test fix thoroughly
6. Restore database from backup if needed
7. Redeploy

## Questions to Ask User Before Modifications

1. "Is this change adding any new user input fields?" → If yes, validate/sanitize
2. "Will this query use user-provided values?" → If yes, use `execParams()`
3. "Is this for the web-facing app or just local scripts?" → Adjust security accordingly
4. "Do we need to preserve backward compatibility?" → Keep deprecated functions if needed
5. "Should I run tests before committing?" → Always yes

## Resources

- SQL.js Documentation: https://sql.js.org/documentation/
- SQLite Security: https://www.sqlite.org/security.html
- OWASP SQL Injection Prevention: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

## Last Updated

- **Date**: 2024-11-18
- **Security Review**: Parameterized queries implemented for core functions
- **Known Vulnerabilities**: None critical (buildNameViewerQuery uses escapeSQL but with controlled input)
