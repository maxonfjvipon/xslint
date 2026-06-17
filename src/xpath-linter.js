/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {evaluateXPathToNodes, registerCustomXPathFunction} = require('fontoxpath')
const {allFilesFrom, yaml} = require('./helpers')
const path = require('node:path')
const {logger} = require('./logger')

/**
 * Namespace URI of the xslint custom XPath functions.
 * @type {string}
 */
const FUNCTIONS = 'https://github.com/maxonfjvipon/xslint'

/**
 * Prefixes.
 * @type {{xsl: string, xslint: string}}
 */
const PREFIXES = {
  'xsl': 'http://www.w3.org/1999/XSL/Transform',
  'xslint': FUNCTIONS,
}

/**
 * In-scope namespace prefixes of given node and its ancestors. fontoxpath
 * hides namespace declarations, so this exposes them to the rules.
 * @param {object} context - Dynamic context, unused
 * @param {Node} node - Context node
 * @return {Array.<string>} - Declared namespace prefixes
 */
const inScopePrefixes = function(context, node) {
  const prefixes = new Set(['xml'])
  for (let element = node; element; element = element.parentNode) {
    for (const attribute of Array.from(element.attributes || [])) {
      if (attribute.nodeName.startsWith('xmlns:')) {
        prefixes.add(attribute.nodeName.slice('xmlns:'.length))
      }
    }
  }
  return Array.from(prefixes)
}

registerCustomXPathFunction(
  {namespaceURI: FUNCTIONS, localName: 'in-scope-prefixes'},
  ['node()'], 'xs:string*', inScopePrefixes,
)

/**
 * Xpath packs files paths.
 * @type {Array.<string>}
 */
const PACKS = allFilesFrom(path.join(__dirname, 'resources', 'checks'))

/**
 * Resolve prefix.
 * @param {string} prefix - Prefix itself
 * @return {null | string} - Resolved prefix
 */
const resolvePrefix = function(prefix) {
  let spec = null
  if (Object.hasOwn(PREFIXES, prefix)) {
    spec = PREFIXES[prefix]
  }
  return spec
}

/**
 * Evaluate Xpath on given XSL and return found nodes.
 * @param {Document} xsl - XSL document parsed as {@link Document}
 * @param {string} xpath - Xpath
 * @return {{name: string, line: number, pos: number}[]} - Matching
 *  nodes in the order defined by the XPath
 */
const evaluateXpath = function(xsl, xpath) {
  return evaluateXPathToNodes(
    xpath, xsl, null, {}, {namespaceResolver: resolvePrefix},
  ).map((node) => ({
    name: node.nodeName,
    line: node.lineNumber,
    pos: node.columnNumber,
  }))
}

/**
 * Deleting incorrect substring-suppressions from array of arguments
 * @param {Array.<string>} suppressions - Array of suppressed checks
 * @return {Array.<string>} - Normalizing list of suppressions
 */
const validatedSuppressions = function(suppressions) {
  for (const sup of suppressions) {
    if (!PACKS.some((check) => check.includes(sup))) {
      logger.warn(
        `Check with substring '${sup}' does not exist. ` +
        `Delete this '--suppress' or use another one.`,
      )
    }
  }
  if (suppressions.some((sup) => sup === '')) {
    logger.warn(
      'Empty suppress is incorrect. ' +
      'Delete this "--suppress" or use another one.',
    )
    suppressions = suppressions.filter((sup) => (sup) !== '')
  }
  return suppressions
}

/**
 * Lint given XSL by Xpath packs.
 * @param {Document} xsl - XSL document parsed as {@link Document}
 * @param {Array.<string>} suppressions - Array of suppressed checks
 * @return {{severity: string, message: string, line: number, pos: number}[]}
 *  - Defects found
 */
const lintByXpath = function(xsl, suppressions = []) {
  logger.debug(`Xpath linting started`)
  const defects = []
  for (const pack of PACKS) {
    const name = pack.substring(
      pack.lastIndexOf(path.sep) + 1, pack.lastIndexOf('.yaml'),
    )
    if (suppressions.some((sup) => name.includes(sup))) {
      continue
    }
    const yml = yaml.parsedFromFile(pack)
    const nodes = evaluateXpath(xsl, yml.xpath)
    if (nodes.length > 0) {
      for (const node of nodes) {
        defects.push({
          name: name,
          severity: yml.severity,
          message: yml.message,
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
  validatedSuppressions,
}
