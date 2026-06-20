/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {nodes} = require('./xpath')
const {allFilesFrom, yaml} = require('./helpers')
const path = require('node:path')
const {logger} = require('./logger')

/**
 * Xpath packs, each identified by the name suppressions match against.
 * @type {Array.<{name: string, path: string}>}
 */
const PACKS = allFilesFrom(
  path.join(__dirname, 'resources', 'checks', 'xpath'),
).map((pack) => ({
  name: pack.substring(
    pack.lastIndexOf(path.sep) + 1, pack.lastIndexOf('.yaml'),
  ),
  path: pack,
}))

/**
 * Names of the checks this linter owns.
 * @type {Array.<string>}
 */
const names = PACKS.map((pack) => pack.name)

/**
 * Evaluate Xpath on given XSL and return found nodes.
 * @param {Document} xsl - XSL document parsed as {@link Document}
 * @param {string} xpath - Xpath
 * @return {{name: string, line: number, pos: number}[]} - Matching
 *  nodes in the order defined by the XPath
 */
const evaluateXpath = function(xsl, xpath) {
  return nodes(xsl, xpath).map((node) => ({
    name: node.nodeName,
    line: node.lineNumber,
    pos: node.columnNumber,
  }))
}

/**
 * Lint the corpus of stylesheets by per-file Xpath packs.
 * @param {Array.<{file: string, xsl: Document}>} corpus - Parsed stylesheets
 * @param {Array.<string>} suppressions - Array of suppressed checks
 * @return {{name: string, severity: string, message: string, file: string,
 *  line: number, pos: number}[]} - Defects found
 */
const lintByXpath = function(corpus, suppressions = []) {
  logger.debug(`Xpath linting started`)
  const defects = []
  for (const {file, xsl} of corpus) {
    for (const pack of PACKS) {
      if (suppressions.some((sup) => pack.name.includes(sup))) {
        continue
      }
      const yml = yaml.parsedFromFile(pack.path)
      for (const node of evaluateXpath(xsl, yml.xpath)) {
        defects.push({
          name: pack.name,
          severity: yml.severity,
          message: yml.message,
          file: file,
          line: node.line,
          pos: node.pos,
        })
      }
    }
  }
  logger.debug(`Found ${defects.length} defects`)
  return defects
}

module.exports = {
  lintByXpath,
  evaluateXpath,
  names,
}
