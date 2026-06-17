/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const path = require('path')
const fs = require('fs')
const {allFilesFrom, xml} = require('./helpers')
const {lintByXpath, validatedSuppressions} = require('./xpath-linter')
const {logger} = require('./logger')
const stdout = require('./stdout')

/**
 * Linters.
 * @type {Array.<function(Document): Array.<object>>}
 */
const LINTERS = [
  lintByXpath,
]

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
  const defects = []
  for (const stylesheet of stylesheets) {
    const xsl = xml.parsedFromFile(stylesheet)
    logger.debug(`Linting ${stylesheet}...`)
    for (const lint of LINTERS) {
      defects.push(
        ...lint(xsl, suppressions).map(
          (defect) => ({
            ...defect,
            file: stylesheet,
          }),
        ),
      )
    }
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
