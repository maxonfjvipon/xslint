/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const path = require('path')
const fs = require('fs')
const {allFilesFrom, xml} = require('./helpers')
const {lint_by_xpath} = require('./xpath-linter')
const {logger} = require('./logger')
const stdout = require('./stdout')

/**
 * Linters.
 * @type {Array.<function(xsl: String): Array.<Object>>}
 */
const LINTERS = [
  lint_by_xpath,
]

/**
 * Returns all .xsl files paths depending on provided path.
 * @param {String} pth - Path to certain file or directory where .xsl should be placed
 * @return {Array.<String>} - Array of .xsl files paths
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
const process_options = function(options) {
  logger.setLevel(options.logLevel)
}

/**
 * Entry point.
 * @param {String} pth - Path to file or directory with .xsl files to lint
 * @param {{
 *  logLevel: string
 * }} options - CLI options
 */
const xslint = function(pth, options) {
  process_options(options)
  const stylesheets = xsls(path.resolve(process.cwd(), pth))
  logger.debug(`Found ${stylesheets.length} .xsl files to process`)
  const defects = []
  for (const stylesheet of stylesheets) {
    let xsl
    try {
      xsl = xml.parsedFromFile(stylesheet)
    } catch (err) {
      throw err
    }
    logger.debug(`Linting ${stylesheet}...`)
    for (const lint of LINTERS) {
      defects.push(
        ...lint(xsl).map(
          (defect) => ({
            ...defect,
            file: stylesheet
          })
        )
      )
    }
  }
  if (defects.length > 0) {
    logger.info(`Processed files: ${stylesheets.length}, defects found ${defects.length}`)
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
    logger.info(`Processed ${stylesheets.length} files, no defects found`)
  }
}

module.exports = xslint;
