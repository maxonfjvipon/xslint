# Changelog

All notable changes to this project are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the
project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Entries for releases before this file was introduced record their npm
publication date only; detailed notes begin with the Unreleased section.

## Unreleased

- Parse each XPath rule once at load instead of once per file (#256).
- Compute each tokenizer probe once per position (#255).
- Apply the schema-type and node-set rules to XSLT 3.0 stylesheets (#259).
- Make the exit code severity-aware and add `--max-warnings` (#264).
- Send logs to stderr and defects to stdout, and add `--quiet` (#263).
- Add round-trip and offset property tests for the tokenizer (#267).
- Point the README badges at this repository (#254).

## 0.0.6 - 2026-06-29

- Published to npm.

## 0.0.5 - 2026-03-26

- Published to npm.

## 0.0.4 - 2026-03-12

- Published to npm.

## 0.0.3 - 2025-01-22

- Published to npm.

## 0.0.2 - 2025-01-22

- Published to npm.

## 0.0.1 - 2025-01-07

- First release to npm.
