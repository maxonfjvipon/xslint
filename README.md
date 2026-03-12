# Xslint

XSL Linter CLI. The utility checks the quality of the written xslt code.

[![grunt](https://github.com/maxonfjvipon/xslint/actions/workflows/grunt.yml/badge.svg)](https://github.com/maxonfjvipon/xslint/actions/workflows/grunt.yml)
[![PDD status](http://www.0pdd.com/svg?name=maxonfjvipon/xslint)](http://www.0pdd.com/p?name=maxonfjvipon/xslint)
[![Hits-of-Code](https://hitsofcode.com/github/maxonfjvipon/xslint)](https://hitsofcode.com/view/github/maxonfjvipon/xslint)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/maxonfjvipon/eo2js/blob/master/LICENSE.txt)

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
You can check all files in the directory:
```bash
xslint
```
The default directory is the current (.) .

Also you can check some files:
```bash
xslint file1.xsl file2.xsl
```
You can suppress some [checks](#checks) by using `--suppress`:
```bash
xslint --suppress=template-match-are-you-confusing-variable-and-node
```
You can use just part of check's name for this:
```bash
xslint --suppress=confusing-variable-and-node
```
If you want to suppress many checks, use `--suppress` as many times as you need:
```bash
xslint --suppress=monolithic-design --suppress=short-names
```
You can skip several checks at once if they contain a certain substring:
```bash
xslint --suppress=template-match
```
## Checks
Implemented checks:
- `template-match-starts-with-double-slash` - it's not recommended to start 'match' attribute of 'xsl:template' element with '//'
- `template-match-use-double-slash` - it's not recommended to use 'match' attribute of 'xsl:template' element with '//'.
- `template-match-setting-value-of-variable-incorrectly` - assign value to a variable using the 'select' syntax if assigning a string value.
- `template-match-empty-content-in-instructions` - don't use empty content for instructions like 'xsl:for-each' 'xsl:if' 'xsl:when' etc.
- `template-match-use-node-set-extension` - don't use node-set extension function if using XSLT 2.0.
- `template-match-unused-function` - stylesheet functions are unused.
- `template-match-unused-named-template` - named templates in stylesheet are unused.
- `template-match-unused-variable` - variable is unused in the stylesheet.
- `template-match-unused-function-template-parameter` - function or template parameter is unused in the function/template body.
- `template-match-too-many-small-templates` - too many low granular templates in the stylesheet (10 or more).
- `template-match-monolithic-design` - using a single template/function in the stylesheet. You can modularize the code.
- `template-match-output-method-xml` - using the output method 'xml' when generating HTML code.
- `template-match-not-using-schema-types` - the stylesheet is not using any of the built-in Schema types (xs:string etc.), when working in XSLT 2.0 mode.
- `template-match-function-template-complexity` - the function or template's size/complexity is high. There is need for refactoring the code.
- `template-match-null-output-from-stylesheet` - the stylesheet is not generating any useful output. Please relook at the stylesheet logic.
- `template-match-using-namespace-axis` - using the deprecated namespace axis, when working in XSLT 2.0 mode. If you need information about the in-scope namespaces of an element should use the functions fn:in-scope-prefixes and fn:namespace-uri-for-prefix.
- `template-match-can-use-abbreviated-axis-specifier` - using the lengthy axis specifiers like child::, attribute:: or parent::node(). The abbreviation for parent::node() is .. . Instead of child::node use this node. The attribute axis attribute:: can be abbreviated by @.
- `template-match-using-disable-output-escaping` - have set the disable-output-escaping attribute to 'yes'. Please relook at the stylesheet logic.
- `template-match-not-creating-element-correctly` - creating an element node using the xsl:element instruction when could have been possible directly.
- `template-match-are-you-confusing-variable-and-node` - you might be confusing a variable reference with a node reference.
- `template-match-incorrect-use-of-boolean-constants` - incorrectly using the boolean constants as 'true' or 'false'. Use true() instead of 'true', and false() instead of 'false'.
- `template-match-short-names` - using a single character name for variable/function/template. Use meaningful names for these features.
- `template-match-name-starts-with-numeric` - the variable/function/template name starts with a numeric character.

## How to Contribute

First, run `npm install`. Then, run `npm test`. All tests should pass.

Make your changes and then [make](https://www.yegor256.com/2014/04/15/github-guidelines.html) a pull request.