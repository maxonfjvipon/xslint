# Xslint

CLI application for checking the quality of XSL.

[![DevOps By Rultor.com](https://www.rultor.com/b/objectionary/phino)](https://www.rultor.com/p/objectionary/phino)

[![npm](https://img.shields.io/npm/v/@maxonfjvipon/xslint.svg?style=flat)](https://www.npmjs.com/package/@maxonfjvipon/xslint)
[![grunt](https://github.com/maxonfjvipon/xslint/actions/workflows/grunt.yml/badge.svg)](https://github.com/maxonfjvipon/xslint/actions/workflows/grunt.yml)
[![PDD status](http://www.0pdd.com/svg?name=maxonfjvipon/xslint)](http://www.0pdd.com/p?name=maxonfjvipon/xslint)
[![Hits-of-Code](https://hitsofcode.com/github/maxonfjvipon/xslint)](https://hitsofcode.com/view/github/maxonfjvipon/xslint)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/maxonfjvipon/eo2js/blob/master/LICENSE.txt)

## Installation

To install `xslint` you need to install [npm] first. Then run:

```bash
npm install -g @maxonfjvipon/xslint@0.0.5
xslint --version
```

## Build

To build `xslint` from source, clone this repository:

```bash
git clone git@github.com:maxonfjvipon/xslint.git
cd xslint
```

Next, run these commands to install `xslint` system-wide:

```bash
npm install
npm install -g .
```

Verify that `xslint` is installed correctly:

```bash
$ xslint --version
0.0.0
```

## Usage

You can check all files in current directory:

```bash
xslint
```

To check specified files - provide them as arguments:

```bash
xslint path/to/your/file1.xsl path/to/your/file2.xsl
```

You can suppress some [checks][checks] by using `--suppress` option:

```bash
xslint --suppress=template-match-are-you-confusing-variable-and-node
```

You can skip several checks at once if they contain a certain substring:

```bash
xslint --suppress=template-match
```

If you want to suppress many checks, use `--suppress` as many times as you need:

```bash
xslint --suppress=monolithic-design --suppress=short-names
```

## Checks

The full list of checks with descriptions and examples is available at
[maxonfjvipon.github.io/xslint][checks].

Checks come in two kinds:

- **Per-file** checks evaluate one stylesheet at a time (most checks).
- **Cross-file** checks reason across all the stylesheets you lint together.
  For example, a named template defined in one file but invoked from another
  (via `xsl:import`/`xsl:include`) is not reported as unused. Lint the whole
  project at once so these checks can see every caller.

## How to Contribute

Fork repository, make changes, then send us a [pull request][guidelines].
We will review your changes and apply them to the `master` branch shortly,
provided they don't violate our quality standards. To avoid frustration,
before sending us your pull request please make sure all your tests pass:

```bash
npm test
```

New checks live in `src/resources/checks/xpath` (per-file) or
`src/resources/checks/corpus` (cross-file), each with a matching test pack
in `test/resources`. Regenerate the documentation site with `npx grunt docs`.

You will need [npm] and [node] installed

[npm]: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
[node]: https://nodejs.org/en
[guidelines]: https://www.yegor256.com/2014/04/15/github-guidelines.html
[checks]: https://maxonfjvipon.github.io/xslint/
