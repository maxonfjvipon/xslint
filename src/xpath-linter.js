/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {evaluateXPathToNodes} = require('fontoxpath')
const {allFilesFrom, yaml} = require('./helpers')
const path = require('node:path')
const {logger} = require('./logger')

/**
 * Prefixes.
 * @type {{xsl: string}}
 */
const PREFIXES = {
  'xsl': 'http://www.w3.org/1999/XSL/Transform'
}

/**
 * Xpath packs files paths.
 * @type {Array.<String>}
 */
const PACKS = allFilesFrom(path.join(__dirname, 'resources'));

/**
 * Resolve prefix.
 * @param {String} prefix - Prefix itself
 * @return {null|String} - Resolved prefix
 */
const resolvePrefix = function(prefix) {
  let spec = null
  if (Object.hasOwn(PREFIXES, prefix)) {
    spec = PREFIXES[prefix]
  }
  return spec
};

/**
 * Evaluate Xpath on given XSL and return found nodes.
 * @param {Document} xsl - XSL document parsed as {@link Document}
 * @param {String} xpath - Xpath
 * @return {{name: String, line: number, pos: number}[]} - All matching Nodes, in the order defined by the XPath.
 */
const evaluate_xpath = function(xsl, xpath) {
  return evaluateXPathToNodes(
    xpath, xsl, null, {}, {namespaceResolver: resolvePrefix}
  ).map((node) => ({
    name: node.nodeName,
    line: node.lineNumber,
    pos: node.columnNumber
  }))
}

/**
 * Lint given XSL by Xpath packs.
 * @param {Document} xsl - XSL document parsed as {@link Document}
 * @return {{severity: string, message: string, line: number, pos: number}[]} - Defects found
 */
const lint_by_xpath = function(xsl) {
  logger.debug(`Xpath linting started`)
  const defects = []
  for (const pack of PACKS) { //правила
    const yml = yaml.parsedFromFile(pack)
    const nodes = evaluate_xpath(xsl, yml.xpath)
    if (nodes.length > 0) {
      for (const node of nodes) {
        defects.push({
          name: pack.substring(pack.lastIndexOf(path.sep) + 1, pack.lastIndexOf('.yaml')),
          severity: yml.severity,
          message: yml.message,
          line: node.line,
          pos: node.pos
        })
      }
    }
  }
  logger.debug(`Found ${defects.length} defects`)
  return defects
}

module.exports = {
  lint_by_xpath,
  evaluate_xpath,
}
