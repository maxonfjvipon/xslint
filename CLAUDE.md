 # CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Workflow

Always start work from a clean master:

```bash
git checkout master
git pull origin master
```

## Commands

```bash
npm test                      # Run all tests + ESLint (via Grunt)
npx mocha test/xslint.test.js --timeout 10000   # Run a single test file
npx mocha test/xslint.test.js --grep "sentence"  # Run tests matching a pattern
```

## Architecture

**xslint** is a CLI linter for XSL stylesheets. It finds `.xsl` files, parses them as XML, evaluates XPath rules against each file, and reports defects.

Linting flow:
```text
src/index.js (CLI, commander.js)
  → src/xslint.js (file discovery, defect aggregation, stdout output)
    → src/xpath-linter.js (XPath rule engine using fontoxpath)
      → src/resources/checks/*.yaml (rule definitions)
```

**Rule format** (`src/resources/checks/<name>.yaml`):
```yaml
xpath: <XPath expression that selects violation nodes>
severity: warning|error
message: <human-readable explanation>
```
XPath uses namespace prefix `xsl:` → `http://www.w3.org/1999/XSL/Transform`.

**Test case format** (`test/resources/xpath-packs/<name>.yaml`):
```yaml
pack: <rule-filename-without-extension>
found:
  amount: <expected violation count>
  positions: [ [line, col], ... ]
input: |-
  <?xml version="1.0"?>
  <xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">
    ...
  </xsl:stylesheet>
```

The test suite (`test/xpath-linter.test.js`) auto-discovers all `test/resources/xpath-packs/*.yaml` files and validates each against its corresponding rule.

## Adding a New Rule

1. Create `src/resources/checks/<rule-name>.yaml` with `xpath`, `severity`, and `message`.
2. Create `test/resources/xpath-packs/<rule-name>.yaml` with matching `pack`, `found`, and `input`.
3. Run `npm test` to verify.

Suppression by users: `xslint --suppress=<rule-substring>`.

## Key Files

| File | Role |
|------|------|
| `src/xslint.js` | Orchestrates file discovery, invokes linter, formats output |
| `src/xpath-linter.js` | Loads YAML rules, evaluates XPath, returns defects |
| `src/helpers.js` | XML parsing (`@xmldom/xmldom`), YAML parsing, file recursion |
| `src/logger.js` | 4-level logger (debug/info/warning/error) |
| `test/helpers.js` | `runXslint` / `runXcop` test utilities |
