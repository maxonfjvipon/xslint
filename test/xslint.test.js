/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const runXslint = require('./helpers')
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
    assert.ok(stdout.includes('Processed files: 1, defects found 7'))
    assert.ok(stdout.includes('(25:17) Don\'t use empty content for instructions like \'xsl:for-each\' \'xsl:if\' \'xsl:when\' etc. (template-match-empty-content-in-instructions)'))
    assert.ok(stdout.includes('(27:17) Don\'t use empty content for instructions like \'xsl:for-each\' \'xsl:if\' \'xsl:when\' etc. (template-match-empty-content-in-instructions)'))
    assert.ok(stdout.includes('(2:1) The stylesheet is not using any of the built-in Schema types (xs:string etc.), when working in XSLT 2.0 mode. (template-match-not-using-schema-types)'))
    assert.ok(stdout.includes('(14:5) Assign value to a variable using the \'select\' syntax if assigning a string value. (template-match-setting-value-of-variable-incorrectly)'))
    assert.ok(stdout.includes('(14:5) Using a single character name for variable/function/template. Use meaningful names for these features. (template-match-short-names)'))
    assert.ok(stdout.includes('(33:5) It\'s not recommended to start \'match\' attribute of \'xsl:template\' element with \'//\' (template-match-starts-with-double-slash)'))
    assert.ok(stdout.includes('(45:5) Named templates in stylesheet are unused. (template-match-unused-named-template)'))
  })
  it('should print no violations in xsl file', function() {
    const stdout = runXslint(['test/resources/xsl-packs/xsl-with-no-violations.xsl'])
    assert.ok(stdout.includes('Processed 1 files, no defects found'))
  })
})
