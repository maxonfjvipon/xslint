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
const PACKS = allFilesFrom(path.resolve(__dirname, 'resources', 'xpath-packs')) //распаковываем тесты

describe('xpath-linter', function() {
  PACKS.forEach((pack) => {
    const yml = yaml.parsedFromFile(pack)
    const lint = yaml.parsedFromFile(
        path.resolve(__dirname, '../src/resources', `${yml.pack}.yaml`), //правило к тесту
    )
    const input = xml.parsedFromString(yml.input)
    //проверяем каждый тест
    let anotherViolation = 0;
    yml.found.positions.forEach((position, index) => {
      //в случае, если правило составляет длиной 3, то positions++ (пропускаем позицию)
      if (yml.found.positions[index][2]!==null) {
        anotherViolation++
      }
    })
    it(`should find ${yml.found.amount-anotherViolation} node(s) by xpath in ${yml.pack}`, function() { //не 2, а 1
      const evaluated = evaluate_xpath(input, lint.xpath)
      yml.found.positions.forEach((position, index) => {
        //в случае, если правило составляет длиной 3, то positions++ (пропускаем позицию)
        if (yml.found.positions[index][2]===null) {
          assert.equal(evaluated[index].line, yml.found.positions[index][0])
          assert.equal(evaluated[index].pos, yml.found.positions[index][1])
        }
        else {
          position++
        }
      })
    })
    it(`should return defects array with ${yml.found.amount} elements`, function() {
      const defects = lint_by_xpath(input)
      assert.equal(defects.length, yml.found.amount)
      defects.forEach((defect, index) => {
        assert.equal(defect.severity, lint.severity)
        assert.equal(defect.message, lint.message)
        assert.equal(defect.line, yml.found.positions[index][0])
        assert.equal(defect.pos, yml.found.positions[index][1])
        assert.equal(defect.name, yml.pack)
      })
    })
  })
})
