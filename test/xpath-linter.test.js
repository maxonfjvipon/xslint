/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2025 Max Trunnikov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
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
    it(`should find ${yml.found.amount} node(s) by xpath in ${yml.pack}`, function() {
      const evaluated = evaluate_xpath(input, lint.xpath)
      assert.equal(
        evaluated.length,
        yml.found.amount,
      )
      yml.found.positions.forEach((position, index) => {
        assert.equal(evaluated[index].line, yml.found.positions[index][0])
        assert.equal(evaluated[index].pos, yml.found.positions[index][1])
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
