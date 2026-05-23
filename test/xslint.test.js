/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {runXslint} = require('./helpers')
const assert = require('assert')
const version = require('../src/version')
const path = require('path');

describe('xslint', function() {
  it('should print its own version', function() {
    const stdout = runXslint(['--version'])
    assert.equal(version.what + '\n', stdout)
  })
  it('should print help screen', function() {
    const stdout = runXslint(['--help'])
    assert.ok(stdout.includes('Usage: xslint'))
    assert.ok(stdout.includes(version.what))
    assert.ok(stdout.includes(version.when))
  })
  it('should set log level', function() {
    const stdout = runXslint(['src', '--log-level=debug'])
    assert.ok(stdout.includes('Log level set to \'debug\''))
  })
  it('should print some violations in xsl file', function() {
    const stdout = runXslint(['test/resources/xsl-packs/xsl-with-some-violations.xsl'])
    const expected = [
      'Processed files: 1',
      'Defects found: 7',
      '(26:9) An instruction element such as xsl:for-each, xsl:if, or xsl:when has no content. Add content or remove the empty element. (template-match-empty-content-in-instructions)',
      '(27:9) An instruction element such as xsl:for-each, xsl:if, or xsl:when has no content. Add content or remove the empty element. (template-match-empty-content-in-instructions)',
      '(6:1) No built-in Schema types are used in XSLT 2.0 mode. Declare variable types with xs:string, xs:integer, or similar. (template-match-not-using-schema-types)',
      '(16:3) A variable is assigned via a nested xsl:value-of instead of the select attribute. Use select syntax instead. (template-match-setting-value-of-variable-incorrectly)',
      '(16:3) A variable, function, or template has a single-character name. Use a descriptive name that reveals intent. (template-match-short-names)',
      '(31:3) The match attribute of xsl:template starts with //, which scans the entire document tree. Use a more specific pattern. (template-match-starts-with-double-slash)',
      '(39:3) A named template is never invoked via xsl:call-template. Remove it or call it. (template-match-unused-named-template)',
    ]
    expected.forEach((str) => assert.ok(stdout.includes(str)))
  })
  it('should print less violations in xsl file', function() {
    const stdout = runXslint([
      'test/resources/xsl-packs/xsl-with-some-violations.xsl',
      '--suppress=empty-content-in-instructions',
      '--suppress=template-match-starts-with-double-slash'
    ]);
    ['Processed files: 1', 'Defects found: 4'].forEach((expected) => assert.ok(stdout.includes(expected)))
    const absented = [
      'template-match-empty-content-in-instructions',
      'template-match-starts-with-double-slash',
    ]
    absented.forEach((str) => assert.ok(!stdout.includes(str)))
  })
  it('should print no violations in xsl file', function() {
    const stdout = runXslint(['test/resources/xsl-packs/xsl-with-no-violations.xsl']);
    ['Processed files: 1', 'No defects found'].forEach((expected) => assert.ok(stdout.includes(expected)))
  })
  it('should test all files', function() {
    const stdout = runXslint([
      'test/resources/xsl-packs/xsl-with-some-violations.xsl',
      'test/resources/xsl-packs/xsl-with-no-violations.xsl'
    ])
    const expected = [
      'test/resources/xsl-packs/xsl-with-some-violations.xsl',
      'test/resources/xsl-packs/xsl-with-no-violations.xsl',
    ]
    expected.forEach((str) => assert.ok(stdout.includes(str.split(path.sep).join('/'))))
    assert.ok(stdout.includes('Processed files: 2'));
  })
  it('should test all directories', function() {
    const stdout = runXslint([
      'test/resources/xsl-packs',
      'test/resources/xsl-packs-2'
    ])
    const expected = [
      'test/resources/xsl-packs',
      'test/resources/xsl-packs-2',
    ]
    expected.forEach((str) => assert.ok(stdout.includes(`${path.resolve(process.cwd(), str)}`)))
    assert.ok(stdout.includes('Processed files: 4'));
  })
  it('should test all files and directories', function() {
    const stdout = runXslint([
      'test/resources/xsl-packs',
      'test/resources/xsl-packs-2/xsl-with-no-violations.xsl',
      'test/resources/xsl-packs-3',
      'test/resources/xsl-packs-2/xsl-with-some-violations.xsl'
    ])
    const expected = [
      'test/resources/xsl-packs',
      'test/resources/xsl-packs-2/xsl-with-some-violations.xsl',
      'test/resources/xsl-packs-3',
      'test/resources/xsl-packs-2/xsl-with-no-violations.xsl',
    ]
    expected.forEach((str) => assert.ok(stdout.includes(`${str.replace(/\\/g, '/')}`)))
    assert.ok(stdout.includes('Processed files: 6'));
  })
  it('should test default directory', function() {
    const stdout = runXslint([])
    assert.ok(stdout.includes('Directories and files to process: .'));
    assert.ok(stdout.includes('Processed files: 6'));
  })
  it('should test non-existing directory', function() {
    const dir = 'non-existing-directory'
    const stdout = runXslint([`${dir}`])
    assert.ok(stdout.includes(`File or directory ${path.resolve(process.cwd(), dir)} does not exist`));
  })
  it('should test non-existing file', function() {
    const file = 'non-existing-file.xsl'
    const stdout = runXslint([`${file}`])
    assert.ok(stdout.includes(`File or directory ${path.resolve(process.cwd(), file)} does not exist`));
  })
  it('should test non-existing file and directory', function() {
    const file = 'non-existing-file.xsl'
    const dir = 'non-existing-directory'
    const stdout = runXslint([`${file}`, `${dir}`])
    assert.ok(stdout.includes(`File or directory ${path.resolve(process.cwd(), file)} does not exist`));
    assert.ok(stdout.includes(`File or directory ${path.resolve(process.cwd(), dir)} does not exist`));
  })
})
