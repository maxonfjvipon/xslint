/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const path = require('path')
const fs = require('fs')
const {allFilesFrom, xml} = require('./helpers')
const {lintByXpath, names: xpathChecks} = require('./xpath-linter')
const {lintByCorpus, names: corpusChecks} = require('./corpus-linter')
const {logger} = require('./logger')
const stdout = require('./stdout')

/**
 * Linters, each given the whole corpus of parsed stylesheets.
 * @type {Array.<function(Array.<{file: string, xsl: Document}>,
 *  Array.<string>): Array.<object>>}
 */
const LINTERS = [
  lintByXpath,
  lintByCorpus,
]

/**
 * Names of every check across all linters, that suppressions match against.
 * @type {Array.<string>}
 */
const CHECKS = [...xpathChecks, ...corpusChecks]

/**
 * Deleting incorrect substring-suppressions from array of arguments
 * @param {Array.<string>} suppressions - Array of suppressed checks
 * @return {Array.<string>} - Normalizing list of suppressions
 */
const validatedSuppressions = function(suppressions) {
  for (const sup of suppressions) {
    if (!CHECKS.some((check) => check.includes(sup))) {
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
 * Returns all .xsl files paths depending on provided path.
 * @param {string} pth - Path to a file or directory holding .xsl files
 * @return {Array.<string>} - Array of .xsl files paths
 */
const xsls = function(pth) {
  let files
  if (fs.statSync(pth).isDirectory()) {
    files = allFilesFrom(pth)
  } else {
    files = [pth]
  }
  return files.filter((file) => file.endsWith('.xsl'))
}

/**
 * Process cli options.
 * @param {{
 *  logLevel: string
 * }} options - CLI options
 */
const processOptions = function(options) {
  logger.setLevel(options.logLevel)
}

/**
 * Entry point.
 * @param {Array.<string>} pths - Files or directories with .xsl to lint
 * @param {{
 *  logLevel: string
 * }} options - CLI options
 */
const xslint = function(pths, options) {
  const suppressions = validatedSuppressions(options.suppress)
  processOptions(options)
  logger.info(`Directories and files to process: ${pths.join(', ')}`)
  pths = pths.map((pth) => path.resolve(process.cwd(), pth))
  let stylesheets = []
  for (const pth of pths) {
    if (!fs.existsSync(pth)) {
      logger.warn(`File or directory ${pth} does not exist`)
    } else {
      stylesheets = [...stylesheets, ...xsls(pth)]
    }
  }
  logger.debug(`Found ${stylesheets.length} .xsl files to process`)
  const corpus = stylesheets.map((stylesheet) => ({
    file: stylesheet,
    xsl: xml.parsedFromFile(stylesheet),
  }))
  const defects = []
  for (const lint of LINTERS) {
    defects.push(...lint(corpus, suppressions))
  }
  logger.info(`Processed files: ${stylesheets.length}`)
  if (defects.length > 0) {
    logger.info(`Defects found: ${defects.length}`)
    for (const defect of defects) {
      stdout[defect.severity](
        '%s(%d:%d) %s (%s)',
        defect.file,
        defect.line,
        defect.pos,
        defect.message,
        defect.name,
      )
    }
    process.exit(1)
  } else {
    logger.info(`No defects found`)
  }
}

module.exports = xslint
