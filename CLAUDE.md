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

**xslint** is a CLI linter for XSL stylesheets. It finds `.xsl` files, parses them all into a *corpus* of XML documents, runs each linter over the whole corpus, and reports defects.

Linting flow:
```text
src/index.js (CLI, commander.js)
  → src/xslint.js (file discovery, corpus building, suppression, stdout output)
    → src/xpath-linter.js (per-file rules)   → src/resources/checks/xpath/*.yaml
    → src/corpus-linter.js (cross-file rules) → src/resources/checks/corpus/*.yaml
        both evaluate via src/xpath.js (fontoxpath environment:
        prefixes, custom functions, node/string evaluators)
```

Every linter has the same shape — `(corpus, suppressions) => defects`, where `corpus` is `[{file, xsl}]` and each defect is tagged with its `file`. `xpath-linter` loops the corpus applying file-local rules; `corpus-linter` reasons across files (e.g. a named template defined in one file but invoked from another is *not* flagged as unused). The two linters do not depend on each other — both depend only on `src/xpath.js`.

**Per-file rule format** (`src/resources/checks/xpath/<name>.yaml`):
```yaml
xpath: <XPath expression that selects violation nodes>
severity: warning|error
message: <human-readable explanation>
```

**Cross-file (corpus) rule format** (`src/resources/checks/corpus/<name>.yaml`):
```yaml
declaration: <XPath selecting declared nodes that carry an @name>
usage: <XPath selecting the names used, collected across the whole corpus>
severity: warning|error
message: <human-readable explanation>
```
A `declaration` node is a defect only when its `@name` appears in no `usage` value anywhere in the corpus.

XPath uses namespace prefix `xsl:` → `http://www.w3.org/1999/XSL/Transform` and `xslint:` → custom functions (`src/xpath.js`).

**Per-file test pack** (`test/resources/xpath-packs/<name>.yaml`): `pack`, `found.amount`, `found.positions: [[line, col], ...]`, single `input`. Auto-discovered by `test/xpath-linter.test.js`.

**Corpus test pack** (`test/resources/corpus-packs/<name>.yaml`): `pack`, `found.amount`, `found.positions: [[fileIndex, line, col], ...]`, multiple `inputs: [ ... ]`. Auto-discovered by `test/corpus-linter.test.js`.

## Adding a New Rule

Per-file rule:
1. Create `src/resources/checks/xpath/<rule-name>.yaml` with `xpath`, `severity`, `message`.
2. Create `test/resources/xpath-packs/<rule-name>.yaml` with matching `pack`, `found`, `input`.

Cross-file rule:
1. Create `src/resources/checks/corpus/<rule-name>.yaml` with `declaration`, `usage`, `severity`, `message`.
2. Create `test/resources/corpus-packs/<rule-name>.yaml` with matching `pack`, `found`, `inputs`.

Then: optionally add a rationale at `src/resources/motives/{xpath,corpus}/<rule-name>.md`, run `npm test`, and regenerate the doc site with `npx grunt docs`.

Suppression by users: `xslint --suppress=<rule-substring>` (matches names from both linters).

## Key Files

| File | Role |
|------|------|
| `src/xslint.js` | Orchestrates file discovery, builds the corpus, validates suppressions, invokes linters, formats output |
| `src/xpath-linter.js` | Loads `checks/xpath/*.yaml`, applies per-file XPath rules |
| `src/corpus-linter.js` | Loads `checks/corpus/*.yaml`, applies cross-file rules over the corpus |
| `src/xpath.js` | Shared fontoxpath environment: prefixes, custom functions, node/string evaluators |
| `src/helpers.js` | XML parsing (`@xmldom/xmldom`), YAML parsing, file recursion |
| `src/logger.js` | 4-level logger (debug/info/warning/error) |
| `scripts/generate-docs.js` | Builds the `docs/` site from checks + motives (`npx grunt docs`) |
| `test/helpers.js` | `runXslint` / `runXcop` test utilities |
