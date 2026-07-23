/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {configFrom} = require('../src/config')
const assert = require('assert')
const fs = require('fs')
const path = require('path')
const os = require('os')

describe('config', function() {
  it('returns empty defaults when there is no file', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-cfg-'))
    const config = configFrom(undefined, dir)
    fs.rmSync(dir, {recursive: true, force: true})
    assert.deepStrictEqual(config, {
      rules: {},
      exclude: [],
      maxWarnings: null,
      logLevel: null,
      quiet: null,
      base: dir,
    })
  })
  it('reads the rules from a file named explicitly', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-cfg-'))
    const file = path.join(dir, 'custom.yml')
    fs.writeFileSync(file, 'rules:\n  short-names: off\n')
    const config = configFrom(file)
    fs.rmSync(dir, {recursive: true, force: true})
    assert.equal(config.rules['short-names'], 'off')
  })
  it('finds the nearest config walking up from a directory', function() {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-cfg-'))
    fs.writeFileSync(path.join(root, '.xslint.yml'), 'max-warnings: 5\n')
    const nested = path.join(root, 'a', 'b')
    fs.mkdirSync(nested, {recursive: true})
    const config = configFrom(undefined, nested)
    fs.rmSync(root, {recursive: true, force: true})
    assert.equal(config.maxWarnings, 5)
  })
  it('resolves the base to the directory of the config file', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-cfg-'))
    const file = path.join(dir, '.xslint.yml')
    fs.writeFileSync(file, 'exclude:\n  - "x"\n')
    const config = configFrom(file)
    fs.rmSync(dir, {recursive: true, force: true})
    assert.equal(config.base, dir)
  })
  it('reads the log level from the config file', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-cfg-'))
    fs.writeFileSync(path.join(dir, '.xslint.yml'), 'log-level: debug\n')
    const config = configFrom(undefined, dir)
    fs.rmSync(dir, {recursive: true, force: true})
    assert.equal(config.logLevel, 'debug')
  })
  it('parses the exclude globs into a list', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-cfg-'))
    fs.writeFileSync(
      path.join(dir, '.xslint.yml'), 'exclude:\n  - "a/**"\n  - "b/**"\n',
    )
    const config = configFrom(undefined, dir)
    fs.rmSync(dir, {recursive: true, force: true})
    assert.deepStrictEqual(config.exclude, ['a/**', 'b/**'])
  })
  it('drops a rule graded to an unknown severity', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-cfg-'))
    fs.writeFileSync(
      path.join(dir, '.xslint.yml'), 'rules:\n  short-names: bogus\n',
    )
    const config = configFrom(undefined, dir)
    fs.rmSync(dir, {recursive: true, force: true})
    assert.ok(!Object.hasOwn(config.rules, 'short-names'))
  })
})
