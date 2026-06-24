/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {allFilesFrom, xml, yaml} = require('../src/helpers')
const path = require('path')
const assert = require('assert')
const fs = require('fs')
const {runXcop, cmdAvailable} = require('./helpers')

/**
 * Yaml packs holding inline XSL, from every linter.
 * @type {Array<string>}
 */
const PACKS = [
  ...allFilesFrom(path.resolve(__dirname, 'resources', 'xpath-packs')),
  ...allFilesFrom(path.resolve(__dirname, 'resources', 'corpus-packs')),
  ...allFilesFrom(path.resolve(__dirname, 'resources', 'xpath-validator-packs')),
  ...allFilesFrom(path.resolve(__dirname, 'resources', 'xpath-format-packs')),
]

/**
 * Whether xcop is installed.
 * @type {boolean}
 */
const available = cmdAvailable('xcop')

describe('xcop', function() {
  PACKS.forEach((pack) => {
    const yml = yaml.parsedFromFile(pack)
    const inputs = yml.inputs || [yml.input]
    inputs.forEach((input, index) => {
      if (available) {
        it(`should find 0 xcop errors in xsl #${index} of ${path.basename(pack)}`, function() {
          const xsl = path.resolve(
            __dirname, `temp-${path.basename(pack, '.yaml')}-${index}.xsl`,
          )
          fs.writeFileSync(xsl, `${xml.parsedFromString(input)}\n`)
          const stdout = runXcop(xsl)
          fs.unlinkSync(xsl)
          assert.ok(stdout.includes(`${xsl} looks good`))
        })
      }
    })
  })
})
