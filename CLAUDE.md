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

**xslint** is a CLI linter for XSL stylesheets. It runs in two stages: **validators** first establish that the input is valid (each stylesheet is well-formed XML, and every XPath expression compiles), then **linters** run over what passed — the well-formed stylesheets, and the XPath expressions that parse — catching stylistic, semantic, and logical problems. Each validator *partitions* its input: it hands the valid part to the next stage and reports the rest, so one broken file (or one malformed expression) never hides the feedback on the rest.

Flow:
```text
src/index.js (CLI, commander.js)
  → src/xslint.js (file discovery, suppression, run order, output: defects to
      stdout, logs to stderr)
    VALIDATORS (is it valid?) — each partitions its input, reporting the bad
    → src/xsl-validator.js (XML well-formedness) builds the corpus of
        parseable files          → src/resources/checks/validation/malformed-stylesheet.yaml
    → src/xpath-validator.js (XPath syntax, over the corpus) keeps the valid
        expressions              → src/resources/checks/validation/invalid-xpath-expression.yaml
    LINTERS (is it good?) — over the corpus
    → src/xpath-linter.js (per-file rules)    → src/resources/checks/xpath/*.yaml
    → src/corpus-linter.js (cross-file rules) → src/resources/checks/corpus/*.yaml
    EXPRESSION LINTERS (is it good?) — over the valid expressions
    → src/xpath-format-linter.js (XPath formatting; tokenizes via
        src/tokens.js)           → src/resources/checks/format/*.yaml
        xsl-validator, xpath-validator, xpath-linter, corpus-linter evaluate
        via src/xpath.js (fontoxpath environment: prefixes, custom functions,
        node/string evaluators, expression validator); xpath-format-linter
        instead tokenizes via src/tokens.js over the validator's expressions
```

Validators run before linters so the linters reason only over valid input, and each validator *builds* the input the next stage consumes. `xsl-validator` takes `(sources, suppressions)` (raw `{file, content}`) and returns `{corpus, defects}` — the corpus of parseable `{file, xsl}` documents. `xpath-validator` takes that corpus and returns `{expressions, defects}` — the valid `{file, expression}` attribute nodes, with the malformed ones dropped and reported. The document linters share the shape `(corpus, suppressions) => defects`: `xpath-linter` loops the corpus applying file-local rules; `corpus-linter` reasons across files (e.g. a named template defined in one file but invoked from another is *not* flagged as unused). The expression linters share the shape `(expressions, suppressions) => defects`: `xpath-format-linter` tokenizes each valid expression (`src/tokens.js`) and flags redundant whitespace — it never re-checks validity, since the validator already filtered. No module imports another linter or validator: the document linters and `xpath-validator` depend on `src/xpath.js`, `xpath-format-linter` on `src/tokens.js`, all on `src/helpers.js`; the staging is wired only in `src/xslint.js`.

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
A validator carries no XPath rule — its detection logic lives in code, and the YAML supplies only the defect's `severity` and `message`. Two validators live here: `malformed-stylesheet` (`src/xsl-validator.js`, XML well-formedness) and `invalid-xpath-expression` (`src/xpath-validator.js`, XPath syntax). The latter parses every bare-XPath-expression attribute (`select`, `test`, `use`, `value`, `group-by`, `group-adjacent`, plus the XSLT 3.0 `key`, `initial-value`, `xpath`, `context-item`, `with-params`, `namespace-context` — the `EXPRESSIONS` selector in `src/xpath-validator.js`) via `isValid` (`src/xpath.js`), which compiles with fontoxpath (the same engine that runs the rules) under a resolver where every prefix resolves, so only genuine syntax errors fail — unknown prefixes and custom functions do not. Pattern attributes (`match`, `count`, `from`, `group-starting-with`, `group-ending-with`), attribute value templates, and sequence types (`as`) are deliberately not validated as expressions. Each validator reads its own YAML by name (it does not scan the directory), so adding one validator's YAML never feeds another's logic.

**Formatting check format** (`src/resources/checks/format/<name>.yaml`):
```yaml
severity: warning|error
message: <human-readable explanation>
```
Like a validator, a formatting check carries no XPath rule — its detection logic lives in code (`src/xpath-format-linter.js`), and the YAML supplies only `severity` and `message`. The linter consumes the valid expressions the XPath validator kept (so it never re-checks validity) and tokenizes each with `src/tokens.js`, reasoning over the tokens; a malformed expression was already reported by the validator and dropped, so it is never nagged about its spacing. One check lives here: `redundant-whitespace` (a doubled space, or a space leading or trailing the expression; whitespace inside string literals and comments is left alone). `src/tokens.js` is the lexer — a positioned token stream (string, comment, whitespace, other) that preserves whitespace; it is the foundation a future full-fidelity parser grows on to reach structural checks (redundant parentheses, axis abbreviations).

XPath uses namespace prefix `xsl:` → `http://www.w3.org/1999/XSL/Transform` and `xslint:` → custom functions (`src/xpath.js`).

**Per-file test pack** (`test/resources/xpath-packs/<name>.yaml`): `pack`, `found.amount`, `found.positions: [[line, col], ...]`, single `input`. Auto-discovered by `test/xpath-linter.test.js`.

**Corpus test pack** (`test/resources/corpus-packs/<name>.yaml`): `pack`, `found.amount`, `found.positions: [[fileIndex, line, col], ...]`, multiple `inputs: [ ... ]`. Auto-discovered by `test/corpus-linter.test.js`.

**XPath validator test pack** (`test/resources/xpath-validator-packs/<name>.yaml`): `pack`, `found.amount`, `found.positions: [[line, col], ...]`, single `input`. Auto-discovered by `test/xpath-validator.test.js`. The XSL validator is tested separately in `test/xsl-validator.test.js` with inline `{file, content}` sources (well-formed and malformed), and the end-to-end gating (parseable files linted, malformed ones reported and skipped) in `test/xslint.test.js` over a temp directory.

**XPath format test pack** (`test/resources/xpath-format-packs/<name>.yaml`): `pack`, `found.amount`, `found.positions: [[line, col], ...]`, single `input`. Auto-discovered by `test/xpath-format-linter.test.js`. The lexer is unit-tested separately in `test/tokens.test.js`.

**xcop formatting** — `test/xcop.test.js` extracts the inline XSL from every pack directory holding *well-formed* fixtures (`xpath-packs`, `corpus-packs`, `xpath-validator-packs`, `xpath-format-packs`), re-serializes it, and runs [xcop](https://github.com/yegor256/xcop) over it to verify the fixtures are well-formatted XML (skipped when `xcop` is not installed). The XML validator's malformed fixtures are deliberately not xcop-checked. A new pack directory of well-formed fixtures must be added to its `PACKS` list, or it goes unchecked.

**Stylesheet fixtures in tests** — build them from committed `.xsl` resources (under `test/resources/`, linted by path) or the pack `input:` block scalar, never from JavaScript string concatenation like `[...].join('\n')`. The `fixtures` CI job complains (a warning annotation) when a test does. Two exceptions stay inline as template literals: malformed stylesheets (xcop cannot accept them as committed files) and trivial one-to-five-line snippets. Note that a committed `.xsl` is counted by the `should test default directory` test, so adding one bumps its `Processed files: N`.

## Adding a New Rule

Rule names are kebab-case with no `template-match-` (or other noise) prefix. Every rule needs a motive and at least one test pack. `test/conformance.test.js` enforces all three across `xpath` and `corpus` (naming and motives are enforced for `validation` and `format` too), so a rule that misnames itself, drops its motive, or ships without a pack fails the build.

Per-file rule:
1. Create `src/resources/checks/xpath/<rule-name>.yaml` with `xpath`, `severity`, `message`.
2. Create `test/resources/xpath-packs/<rule-name>.yaml` with matching `pack`, `found`, `input`.

Cross-file rule:
1. Create `src/resources/checks/corpus/<rule-name>.yaml` with `declaration`, `usage`, `severity`, `message`.
2. Create `test/resources/corpus-packs/<rule-name>.yaml` with matching `pack`, `found`, `inputs`.

Validators and formatting checks are not extended this way: their logic is fixed in `src/xsl-validator.js`, `src/xpath-validator.js`, and `src/xpath-format-linter.js`, and their YAML (`checks/validation/<name>.yaml` and `checks/format/<name>.yaml`) only tunes `severity` and `message`.

Then: add a rationale (required) at `src/resources/motives/{xpath,corpus,validation,format}/<rule-name>.md`, run `npm test`, and regenerate the doc site with `npx grunt docs`. A brand-new pack directory of well-formed fixtures must also be registered in `test/xcop.test.js` so its inline XSL is formatting-checked.

Suppression by users: `xslint --suppress=<rule-substring>` (matches names from all validators and linters).

Configuration by users: a `.xslint.yml` file (discovered by walking up from the working directory, or passed with `--config <path>`) can disable rules (`rules: {<name-or-glob>: off}`), re-grade severity (`warning`/`error`), skip files (`exclude:` globs, resolved relative to the config file's own directory), and set defaults for `max-warnings`, `log-level`, and `quiet`. Unknown top-level keys and rule patterns that match no check are reported. Inline suppression by users: XML-comment directives — `<!-- xslint-disable-next-line [rules] -->` (line after the comment), `<!-- xslint-disable-line [rules] -->` (the comment's line), `<!-- xslint-disable-file [rules] -->` (the whole file); rule names are optional and space-separated, and none means all. `src/directives.js` scans the raw text for them and `src/xslint.js` drops matching defects after collecting them (so it covers every kind, warns on an unknown rule name, and reports a directive that suppressed nothing as unused).

Command-line flags override the file; the file overrides the built-in defaults. Resolution lives in `src/config.js` (which also exposes the config's `base` directory); `src/xslint.js` expands each rule pattern against the check names, folds `off` rules into the suppression list, filters excluded files against `base`, applies severity overrides to the collected defects, and resolves the effective `max-warnings`/`log-level`/`quiet`.

## Keeping Docs in Sync

Any change to behavior — new logic, a new check or validator, a rename, a moved file, a changed flag or output — must update the documentation in the same change. Before finishing, check all three and fix whichever went stale:

- **`README.md`** — user-facing: installation, usage, the validators/linters overview, the contribution notes.
- **`CLAUDE.md`** (this file) — architecture: the flow diagram, the `(corpus, suppressions) => defects` shapes, the check/validator formats, the test-pack layout, and the Key Files table.
- **The docs site** — generated from `src/resources/checks/*` and `src/resources/motives/*`; regenerate with `npx grunt docs`. A new kind also needs wiring in `scripts/generate-docs.js`.

A change that leaves any of these describing the old behavior is not done.

## Key Files

| File | Role |
|------|------|
| `src/xslint.js` | Orchestrates file discovery, configuration, and suppression, runs validators then linters, formats output |
| `src/config.js` | Resolves `.xslint.yml` (rule severities/`off`, exclude globs, `max-warnings`), found by walking up from the cwd or via `--config` |
| `src/directives.js` | Parses inline `xslint-disable-*` comment directives and tests whether one suppresses a defect |
| `src/xsl-validator.js` | Builds the corpus from raw sources; reports each stylesheet that is not well-formed XML and leaves it out |
| `src/xpath-validator.js` | Splits each corpus expression into the valid ones (kept for the expression linters) and the malformed ones (reported) |
| `src/xpath-linter.js` | Loads `checks/xpath/*.yaml`, applies per-file XPath rules |
| `src/corpus-linter.js` | Loads `checks/corpus/*.yaml`, applies cross-file rules over the corpus |
| `src/xpath-format-linter.js` | Tokenizes the validator's valid expressions and flags formatting noise (`redundant-whitespace`) |
| `src/tokens.js` | XPath lexer: positioned token stream (`TOKENS`: string, comment, whitespace, other) preserving whitespace |
| `src/xpath.js` | Shared fontoxpath environment: prefixes, custom functions, node/string evaluators, expression validator (`isValid`) |
| `src/helpers.js` | XML parsing (`@xmldom/xmldom`), YAML parsing, file recursion |
| `src/logger.js` | 4-level logger (debug/info/warning/error) |
| `scripts/generate-docs.js` | Builds the `docs/` site from checks + motives (`npx grunt docs`) |
| `test/helpers.js` | `runXslint` / `runXcop` test utilities |
| `test/xcop.test.js` | Runs xcop over the inline XSL of every pack directory; register new pack dirs here |
