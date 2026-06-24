/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {nodes, isValid} = require('./xpath')
const {yaml} = require('./helpers')
const path = require('node:path')
const {logger} = require('./logger')

/**
 * Name of the check this validator owns.
 * @type {string}
 */
const CHECK = 'invalid-xpath-expression'

/**
 * Defect metadata of the check.
 * @type {{severity: string, message: string}}
 */
const META = yaml.parsedFromFile(
  path.join(__dirname, 'resources', 'checks', 'validation', `${CHECK}.yaml`),
)

/**
 * Names of the checks this validator owns.
 * @type {Array.<string>}
 */
const names = [CHECK]

/**
 * Attribute nodes that carry a bare Xpath expression, scoped to XSLT elements
 * so literal result elements are left alone. Pattern attributes (match, count,
 * from, group-starting-with, group-ending-with), attribute value templates,
 * and sequence types (as) are not expressions and stay out.
 * @type {string}
 */
const EXPRESSIONS =
  '//xsl:*/@*[local-name() = (' +
  '"select", "test", "use", "value", "group-by", "group-adjacent", ' +
  '"key", "initial-value", "xpath", "context-item", "with-params", ' +
  '"namespace-context")]'

/**
 * Validate every Xpath expression in the corpus, splitting the valid ones out
 * for the linters to consume from the malformed ones, which become defects.
 * An expression that cannot be parsed by the engine that would run it is
 * reported and dropped, so no linter ever reasons over broken input.
 * @param {Array.<{file: string, xsl: Document}>} corpus - Parsed stylesheets
 * @param {Array.<string>} suppressions - Array of suppressed checks
 * @return {{expressions: Array.<{file: string, expression: Node}>, defects:
 *  {name: string, severity: string, message: string, file: string,
 *  line: number, pos: number}[]}} - Valid expressions and defects found
 */
const validate = function(corpus, suppressions = []) {
  logger.debug(`Xpath validation started`)
  const expressions = []
  const defects = []
  const suppressed = suppressions.some((sup) => CHECK.includes(sup))
  for (const {file, xsl} of corpus) {
    for (const expression of nodes(xsl, EXPRESSIONS)) {
      if (isValid(expression.nodeValue)) {
        expressions.push({file: file, expression: expression})
      } else if (!suppressed) {
        defects.push({
          name: CHECK,
          severity: META.severity,
          message: META.message,
          file: file,
          line: expression.lineNumber,
          pos: expression.columnNumber,
        })
      }
    }
  }
  logger.debug(`Found ${defects.length} invalid expressions`)
  return {expressions: expressions, defects: defects}
}

module.exports = {
  validate,
  names,
}
