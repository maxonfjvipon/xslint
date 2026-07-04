/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {nodes, strings} = require('./xpath')
const {allFilesFrom, yaml} = require('./helpers')
const path = require('node:path')
const {logger} = require('./logger')

/**
 * Corpus checks, each identified by the name suppressions match against.
 * @type {Array.<{name: string, path: string}>}
 */
const CHECKS = allFilesFrom(
  path.join(__dirname, 'resources', 'checks', 'corpus'),
).map((check) => ({
  name: check.substring(
    check.lastIndexOf(path.sep) + 1, check.lastIndexOf('.yaml'),
  ),
  path: check,
}))

/**
 * Names of the checks this linter owns.
 * @type {Array.<string>}
 */
const names = CHECKS.map((check) => check.name)

/**
 * Lint the whole corpus of stylesheets by cross-file checks. A declaration is
 * a defect only when its name is used by no stylesheet in the corpus, so a
 * named template defined in one file but invoked from another is not flagged.
 * @param {Array.<{file: string, xsl: Document}>} corpus - Parsed stylesheets
 * @param {Array.<string>} suppressions - Array of suppressed checks
 * @return {{name: string, severity: string, message: string, file: string,
 *  line: number, pos: number}[]} - Defects found
 */
const lintByCorpus = function(corpus, suppressions = []) {
  logger.debug(`Corpus linting started`)
  const defects = []
  for (const check of CHECKS) {
    if (suppressions.some((sup) => check.name.includes(sup))) {
      continue
    }
    const yml = yaml.parsedFromFile(check.path)
    const used = new Set(
      corpus.flatMap(({xsl}) => strings(xsl, yml.usage)),
    )
    for (const {file, xsl} of corpus) {
      for (const node of nodes(xsl, yml.declaration)) {
        if (!used.has(node.getAttribute('name'))) {
          defects.push({
            name: check.name,
            severity: yml.severity,
            message: yml.message,
            file: file,
            line: node.lineNumber,
            pos: node.columnNumber,
          })
        }
      }
    }
  }
  logger.debug(`Found ${defects.length} corpus defects`)
  return defects
}

module.exports = {
  lintByCorpus,
  names,
}
