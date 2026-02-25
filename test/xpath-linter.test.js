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
    const other = yml.found.positions.filter((pos) => pos.length == 3).length
    it(`should find ${yml.found.amount - other} node(s) by xpath in ${yml.pack}`, function() {
      const evaluated = evaluate_xpath(input, lint.xpath)
      assert.equal(
          evaluated.length,
          yml.found.amount - other,
      )
      yml.found.positions.filter((pos) => pos.length == 2).forEach((pos, index) => {
          assert.equal(evaluated[index].line, yml.found.positions[index][0])
          assert.equal(evaluated[index].pos, yml.found.positions[index][1])
      })
    })
    it(`should return defects array with ${yml.found.amount} elements`, function() {
      const defects = lint_by_xpath(input)
      assert.equal(defects.length, yml.found.amount)
      defects.forEach((defect, index) => {
        if (yml.found.positions[index].length == 2) {
          assert.equal(defect.severity, lint.severity)
          assert.equal(defect.message, lint.message)
          assert.equal(defect.name, yml.pack)
        } else {
          const temp = yaml.parsedFromFile(
              path.resolve(__dirname, '../src/resources', `${yml.found.positions[index][2]}.yaml`),
          )
          assert.equal(defect.severity, temp.severity)
          assert.equal(defect.message, temp.message)
          assert.equal(defect.name, yml.found.positions[index][2])
        }
        assert.equal(defect.line, yml.found.positions[index][0])
        assert.equal(defect.pos, yml.found.positions[index][1])
      })
    })
  })
})