/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {allFilesFrom, yaml} = require('../src/helpers')
const path = require('path')
const fs = require('fs')
const assert = require('assert')

/**
 * Directory holding the check definitions.
 * @type {string}
 */
const CHECKS = path.resolve(__dirname, '..', 'src', 'resources', 'checks')

/**
 * Directory holding the check rationales.
 * @type {string}
 */
const MOTIVES = path.resolve(__dirname, '..', 'src', 'resources', 'motives')

/**
 * Directory holding the test packs.
 * @type {string}
 */
const RESOURCES = path.resolve(__dirname, 'resources')

/**
 * Every kind of check.
 * @type {Array.<string>}
 */
const KINDS = ['xpath', 'corpus', 'validation', 'format']

/**
 * Kinds authored as rules, paired with the directory holding their packs. The
 * validation and format checks are code-driven and tested elsewhere.
 * @type {{[kind: string]: string}}
 */
const PACKED = {xpath: 'xpath-packs', corpus: 'corpus-packs'}

/**
 * Kebab-case with no leading or trailing hyphen.
 * @type {RegExp}
 */
const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/

/**
 * Names of the checks of a kind.
 * @param {string} kind - Kind of check
 * @return {Array.<string>} - Check names
 */
const names = function(kind) {
  return allFilesFrom(path.join(CHECKS, kind))
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => path.basename(file, '.yaml'))
}

describe('conformance', function() {
  it('names every check in kebab-case without the banned prefix', function() {
    for (const kind of KINDS) {
      for (const name of names(kind)) {
        assert.ok(KEBAB.test(name), `${kind}/${name} is not kebab-case`)
        assert.ok(
          !name.startsWith('template-match-'),
          `${kind}/${name} carries the banned 'template-match-' prefix`,
        )
      }
    }
  })
  it('gives every check a motive', function() {
    for (const kind of KINDS) {
      for (const name of names(kind)) {
        assert.ok(
          fs.existsSync(path.join(MOTIVES, kind, `${name}.md`)),
          `${kind}/${name} has no motive`,
        )
      }
    }
  })
  it('gives every rule check at least one test pack', function() {
    for (const [kind, dir] of Object.entries(PACKED)) {
      const packed = new Set(
        allFilesFrom(path.join(RESOURCES, dir))
          .filter((file) => file.endsWith('.yaml'))
          .map((file) => yaml.parsedFromFile(file).pack),
      )
      for (const name of names(kind)) {
        assert.ok(packed.has(name), `${kind}/${name} has no test pack`)
      }
    }
  })
  it('maps every motive and pack back to a real check', function() {
    for (const kind of KINDS) {
      const checks = new Set(names(kind))
      for (const motive of allFilesFrom(path.join(MOTIVES, kind))
        .filter((file) => file.endsWith('.md'))) {
        assert.ok(
          checks.has(path.basename(motive, '.md')),
          `motive ${kind}/${path.basename(motive)} names no check`,
        )
      }
    }
    for (const [kind, dir] of Object.entries(PACKED)) {
      const checks = new Set(names(kind))
      for (const pack of allFilesFrom(path.join(RESOURCES, dir))
        .filter((file) => file.endsWith('.yaml'))) {
        assert.ok(
          checks.has(yaml.parsedFromFile(pack).pack),
          `pack ${dir}/${path.basename(pack)} names no check`,
        )
      }
    }
  })
})
