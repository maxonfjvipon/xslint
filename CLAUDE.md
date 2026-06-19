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

**xslint** is a CLI linter for XSL stylesheets. It runs in two stages: **validators** first establish that the input is valid (each stylesheet is well-formed XML, and every XPath expression compiles), then **linters** run over the stylesheets that pass, catching stylistic, semantic, and logical problems. A stylesheet that does not parse is reported once and left out of the corpus, so one broken file never hides the feedback on the rest.

Flow:
```text
src/index.js (CLI, commander.js)
  → src/xslint.js (file discovery, suppression, run order, stdout output)
    VALIDATORS (is it valid?)
    → src/xsl-validator.js (XML well-formedness) builds the corpus from the
        parseable files          → src/resources/checks/validation/malformed-stylesheet.yaml
    → src/xpath-validator.js (XPath compilability, over the corpus)
                                 → src/resources/checks/validation/invalid-xpath-expression.yaml
    LINTERS (is it good?)
    → src/xpath-linter.js (per-file rules)    → src/resources/checks/xpath/*.yaml
    → src/corpus-linter.js (cross-file rules) → src/resources/checks/corpus/*.yaml
        all (except xsl-validator) evaluate via src/xpath.js (fontoxpath
        environment: prefixes, custom functions, node/string evaluators,
        expression validator)
```

Validators run before linters so the linters reason only over valid input. Most components share the shape `(corpus, suppressions) => defects`, where `corpus` is `[{file, xsl}]` and each defect is tagged with its `file`: `xpath-validator` parses each XPath expression and flags the ones the processor cannot parse; `xpath-linter` loops the corpus applying file-local rules; `corpus-linter` reasons across files (e.g. a named template defined in one file but invoked from another is *not* flagged as unused). The exception is `xsl-validator`, which *builds* the corpus — it takes `(sources, suppressions)` (raw `{file, content}`) and returns `{corpus, defects}`, since the corpus everything else consumes does not exist until well-formedness is checked. None of them depend on each other — each depends only on `src/xpath.js` (and `src/helpers.js`).

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

**Validator check format** (`src/resources/checks/validation/<name>.yaml`):
```yaml
severity: warning|error
message: <human-readable explanation>
```
A validator carries no XPath rule — its detection logic lives in code, and the YAML supplies only the defect's `severity` and `message`. Two validators live here: `malformed-stylesheet` (`src/xsl-validator.js`, XML well-formedness) and `invalid-xpath-expression` (`src/xpath-validator.js`, XPath compilability). The latter parses every bare-XPath-expression attribute (`select`, `test`, `use`, `value`, `group-by`, `group-adjacent`, plus the XSLT 3.0 `key`, `initial-value`, `xpath`, `context-item`, `with-params`, `namespace-context`) via `isValid` (`src/xpath.js`), which compiles with fontoxpath (the same engine that runs the rules) under a resolver where every prefix resolves, so only genuine syntax errors fail — unknown prefixes and custom functions do not. Pattern attributes (`match`, `count`, `from`, `group-starting-with`, `group-ending-with`), attribute value templates, and sequence types (`as`) are deliberately not validated as expressions. Each validator reads its own YAML by name (it does not scan the directory), so adding one validator's YAML never feeds another's logic.

XPath uses namespace prefix `xsl:` → `http://www.w3.org/1999/XSL/Transform` and `xslint:` → custom functions (`src/xpath.js`).

**Per-file test pack** (`test/resources/xpath-packs/<name>.yaml`): `pack`, `found.amount`, `found.positions: [[line, col], ...]`, single `input`. Auto-discovered by `test/xpath-linter.test.js`.

**Corpus test pack** (`test/resources/corpus-packs/<name>.yaml`): `pack`, `found.amount`, `found.positions: [[fileIndex, line, col], ...]`, multiple `inputs: [ ... ]`. Auto-discovered by `test/corpus-linter.test.js`.

**XPath validator test pack** (`test/resources/xpath-validator-packs/<name>.yaml`): `pack`, `found.amount`, `found.positions: [[line, col], ...]`, single `input`. Auto-discovered by `test/xpath-validator.test.js`. The XSL validator is tested separately in `test/xsl-validator.test.js` with inline `{file, content}` sources (well-formed and malformed), and the end-to-end gating (parseable files linted, malformed ones reported and skipped) in `test/xslint.test.js` over a temp directory.

**xcop formatting** — `test/xcop.test.js` extracts the inline XSL from every pack directory holding *well-formed* fixtures (`xpath-packs`, `corpus-packs`, `xpath-validator-packs`), re-serializes it, and runs [xcop](https://github.com/yegor256/xcop) over it to verify the fixtures are well-formatted XML (skipped when `xcop` is not installed). The XML validator's malformed fixtures are deliberately not xcop-checked. A new pack directory of well-formed fixtures must be added to its `PACKS` list, or it goes unchecked.

## Adding a New Rule

Per-file rule:
1. Create `src/resources/checks/xpath/<rule-name>.yaml` with `xpath`, `severity`, `message`.
2. Create `test/resources/xpath-packs/<rule-name>.yaml` with matching `pack`, `found`, `input`.

Cross-file rule:
1. Create `src/resources/checks/corpus/<rule-name>.yaml` with `declaration`, `usage`, `severity`, `message`.
2. Create `test/resources/corpus-packs/<rule-name>.yaml` with matching `pack`, `found`, `inputs`.

Validators are not extended this way: their logic is fixed in `src/xsl-validator.js` and `src/xpath-validator.js`, and their `src/resources/checks/validation/<name>.yaml` files only tune `severity` and `message`.

Then: optionally add a rationale at `src/resources/motives/{xpath,corpus,validation}/<rule-name>.md`, run `npm test`, and regenerate the doc site with `npx grunt docs`. A brand-new pack directory of well-formed fixtures must also be registered in `test/xcop.test.js` so its inline XSL is formatting-checked.

Suppression by users: `xslint --suppress=<rule-substring>` (matches names from all validators and linters).

## Keeping Docs in Sync

Any change to behavior — new logic, a new check or validator, a rename, a moved file, a changed flag or output — must update the documentation in the same change. Before finishing, check all three and fix whichever went stale:

- **`README.md`** — user-facing: installation, usage, the validators/linters overview, the contribution notes.
- **`CLAUDE.md`** (this file) — architecture: the flow diagram, the `(corpus, suppressions) => defects` shapes, the check/validator formats, the test-pack layout, and the Key Files table.
- **The docs site** — generated from `src/resources/checks/*` and `src/resources/motives/*`; regenerate with `npx grunt docs`. A new kind also needs wiring in `scripts/generate-docs.js`.

A change that leaves any of these describing the old behavior is not done.

## Key Files

| File | Role |
|------|------|
| `src/xslint.js` | Orchestrates file discovery and suppression, runs validators then linters, formats output |
| `src/xsl-validator.js` | Builds the corpus from raw sources; reports each stylesheet that is not well-formed XML and leaves it out |
| `src/xpath-validator.js` | Parses each XPath expression in the corpus and flags the ones that do not compile |
| `src/xpath-linter.js` | Loads `checks/xpath/*.yaml`, applies per-file XPath rules |
| `src/corpus-linter.js` | Loads `checks/corpus/*.yaml`, applies cross-file rules over the corpus |
| `src/xpath.js` | Shared fontoxpath environment: prefixes, custom functions, node/string evaluators, expression validator (`isValid`) |
| `src/helpers.js` | XML parsing (`@xmldom/xmldom`), YAML parsing, file recursion |
| `src/logger.js` | 4-level logger (debug/info/warning/error) |
| `scripts/generate-docs.js` | Builds the `docs/` site from checks + motives (`npx grunt docs`) |
| `test/helpers.js` | `runXslint` / `runXcop` test utilities |
| `test/xcop.test.js` | Runs xcop over the inline XSL of every pack directory; register new pack dirs here |
