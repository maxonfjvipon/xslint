/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {runXslint} = require('./helpers')
const assert = require('assert')
const version = require('../src/version')

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
      '(25:9) Don\'t use empty content for instructions like \'xsl:for-each\' \'xsl:if\' \'xsl:when\' etc. (template-match-empty-content-in-instructions)',
      '(26:9) Don\'t use empty content for instructions like \'xsl:for-each\' \'xsl:if\' \'xsl:when\' etc. (template-match-empty-content-in-instructions)',
      '(6:1) The stylesheet is not using any of the built-in Schema types (xs:string etc.), when working in XSLT 2.0 mode. (template-match-not-using-schema-types)',
      '(15:3) Assign value to a variable using the \'select\' syntax if assigning a string value. (template-match-setting-value-of-variable-incorrectly)',
      '(15:3) Using a single character name for variable/function/template. Use meaningful names for these features. (template-match-short-names)',
      '(30:3) It\'s not recommended to start \'match\' attribute of \'xsl:template\' element with \'//\' (template-match-starts-with-double-slash)',
      '(38:3) Named templates in stylesheet are unused. (template-match-unused-named-template)',
    ]
    expected.forEach((str) => assert.ok(stdout.includes(str)))
  })
  it('should print less violations in xsl file', function() {
    const stdout = runXslint(['test/resources/xsl-packs/xsl-with-some-violations.xsl', '--suppress=empty-content-in-instructions', '--suppress=template-match-starts-with-double-slash'])
    assert.ok(stdout.includes('Processed files: 1'))
    assert.ok(stdout.includes('Defects found: 4'))
    const absented = [
      'template-match-empty-content-in-instructions',
      'template-match-starts-with-double-slash',
    ]
    absented.forEach((str) => assert.ok(!stdout.includes(str)))
  })
  it('should print no violations in xsl file', function() {
    const stdout = runXslint(['test/resources/xsl-packs/xsl-with-no-violations.xsl'])
    assert.ok(stdout.includes('Processed files: 1'))
    assert.ok(stdout.includes('No defects found'))
  })
  it('should test all files', function() {
    const stdout = runXslint(['test/resources/xsl-packs/xsl-with-some-violations.xsl', 'test/resources/xsl-packs/xsl-with-no-violations.xsl'])
    const expected = [
      'test/resources/xsl-packs/xsl-with-some-violations.xsl',
      'test/resources/xsl-packs/xsl-with-no-violations.xsl'
    ]
    expected.forEach((str) => assert.ok(stdout.includes(str)))
  })
  it('should test all directories', function() {
    const stdout = runXslint(['test/resources/xsl-packs', 'test/resources/xsl-packs-2'])
    const expected = [
      'test/resources/xsl-packs',
      'test/resources/xsl-packs-2'
    ]
    expected.forEach((str) => assert.ok(stdout.includes(str)))
  })
  it('should test all files and directories', function() {
    const stdout = runXslint(['test/resources/xsl-packs', 'test/resources/xsl-packs-2/xsl-with-no-violations.xsl', 'test/resources/xsl-packs-3', 'test/resources/xsl-packs-2/xsl-with-some-violations.xsl'])
    const expected = [
      'test/resources/xsl-packs',
      'test/resources/xsl-packs-2/xsl-with-some-violations.xsl',
      'test/resources/xsl-packs-3',
      'test/resources/xsl-packs-2/xsl-with-no-violations.xsl',
    ]
    expected.forEach((str) => assert.ok(stdout.includes(str)))
  })
})
