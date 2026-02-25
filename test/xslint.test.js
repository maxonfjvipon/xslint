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
    const stdout = runXslint(['test/resources/xsl-packs/file2.xsl'])
    assert.ok(stdout.includes('Processed files: 1, defects found 3'))
  })
  it('should print no violations in xsl file', function() {
    const stdout = runXslint(['test/resources/xsl-packs/file.xsl'])
    assert.ok(stdout.includes('Processed 1 files, no defects found'))
  })
})
