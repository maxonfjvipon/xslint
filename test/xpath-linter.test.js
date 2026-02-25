/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {evaluate_xpath, lint_by_xpath} = require('../src/xpath-linter')
const {allFilesFrom, xml, yaml} = require('../src/helpers')
const path = require('path')
const assert = require('assert')

/**
 * Yaml test packs.
 * @type {Array<String>}
 */
const PACKS = allFilesFrom(path.resolve(__dirname, 'resources', 'xpath-packs'))

describe('xpath-linter', function() {
  PACKS.forEach((pack) => {
    const yml = yaml.parsedFromFile(pack)
    const lint = yaml.parsedFromFile(
      path.resolve(__dirname, '../src/resources', `${yml.pack}.yaml`),
    )
    const input = xml.parsedFromString(yml.input)
    let anotherViolations = 0;
    yml.found.positions.forEach((position, index) => {
      if (!(yml.found.positions[index][2]===null || yml.found.positions[index][2]===undefined)) {
        anotherViolations++
      }
    })
    it(`should find ${yml.found.amount-anotherViolations} node(s) by xpath in ${yml.pack}`, function() {
      const evaluated = evaluate_xpath(input, lint.xpath)

      yml.found.positions.forEach((position, index) => {
        assert.equal(
          evaluated.length,
          yml.found.amount-anotherViolations,
        )
        if (yml.found.positions[index][2]===undefined) {
          assert.equal(evaluated[index].line, yml.found.positions[index][0])
          assert.equal(evaluated[index].pos, yml.found.positions[index][1])
        } else {
          position++
        }
      })
    })
    it(`should return defects array with ${yml.found.amount} elements`, function() {
      const defects = lint_by_xpath(input)
      assert.equal(defects.length, yml.found.amount)
      defects.forEach((defect, index) => {
        if (yml.found.positions[index][2]===undefined) {
          assert.equal(defect.severity, lint.severity)
          assert.equal(defect.message, lint.message)
          assert.equal(defect.line, yml.found.positions[index][0])
          assert.equal(defect.pos, yml.found.positions[index][1])
          assert.equal(defect.name, yml.pack)
        } else {
          const tempLint = yaml.parsedFromFile(
            path.resolve(__dirname, '../src/resources', `${yml.found.positions[index][2]}.yaml`),
          )
          assert.equal(defect.severity, tempLint.severity)
          assert.equal(defect.message, tempLint.message)
          assert.equal(defect.line, yml.found.positions[index][0])
          assert.equal(defect.pos, yml.found.positions[index][1])
          assert.equal(defect.name, yml.found.positions[index][2])
        }
      })
    })
  })
})
