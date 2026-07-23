/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const path = require('path')
const fs = require('fs')
const {allFilesFrom} = require('./helpers')
const {validate: validateXsls, names: xslChecks} = require('./xsl-validator')
const {
  validate: validateXpaths, names: xpathValidatorChecks,
} = require('./xpath-validator')
const {lintByXpath, names: xpathChecks} = require('./xpath-linter')
const {lintByCorpus, names: corpusChecks} = require('./corpus-linter')
const {lintByFormat, names: formatChecks} = require('./xpath-format-linter')
const {logger, levels} = require('./logger')
const {out} = require('./output')
const {configFrom} = require('./config')
const {minimatch} = require('minimatch')

/**
 * Linters, each given the corpus of well-formed stylesheets.
 * @type {Array.<function(Array.<{file: string, xsl: Document}>,
 *  Array.<string>): Array.<object>>}
 */
const LINTERS = [
  lintByXpath,
  lintByCorpus,
]

/**
 * Expression linters, each given the valid Xpath expressions the validator kept
 * so they never reason over malformed input.
 * @type {Array.<function(Array.<{file: string, expression: Node}>,
 *  Array.<string>): Array.<object>>}
 */
const EXPRESSION_LINTERS = [
  lintByFormat,
]

/**
 * Names of every check across all validators and linters, that suppressions
 * match against.
 * @type {Array.<string>}
 */
const CHECKS = [
  ...xslChecks, ...xpathValidatorChecks,
  ...xpathChecks, ...corpusChecks, ...formatChecks,
]

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
 * Whether a file matches any exclusion glob, compared as a path relative to the
 * working directory in posix form so the patterns stay portable.
 * @param {string} file - Absolute path of a stylesheet
 * @param {Array.<string>} patterns - Exclusion globs from the configuration
 * @return {boolean} - True when the file is excluded
 */
const excluded = function(file, patterns) {
  const relative = path.relative(process.cwd(), file).split(path.sep).join('/')
  return patterns.some((pattern) => minimatch(relative, pattern))
}

/**
 * Process cli options.
 * @param {{
 *  logLevel: string,
 *  quiet: boolean
 * }} options - CLI options
 */
const processOptions = function(options) {
  logger.setLevel(options.quiet ? levels.WARNING : options.logLevel)
}

/**
 * Entry point.
 * @param {Array.<string>} pths - Files or directories with .xsl to lint
 * @param {{
 *  logLevel: string,
 *  quiet: boolean,
 *  suppress: Array.<string>,
 *  maxWarnings: number|undefined,
 *  config: string|undefined
 * }} options - CLI options
 */
const xslint = function(pths, options) {
  const config = configFrom(options.config)
  for (const name of Object.keys(config.rules)) {
    if (!CHECKS.includes(name)) {
      logger.warn(`Rule '${name}' in configuration does not exist`)
    }
  }
  const suppressions = [
    ...validatedSuppressions(options.suppress),
    ...Object.keys(config.rules).filter((name) => config.rules[name] === 'off'),
  ]
  const maxWarnings = options.maxWarnings ?? config.maxWarnings ?? -1
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
  stylesheets = stylesheets.filter((file) => !excluded(file, config.exclude))
  logger.debug(`Found ${stylesheets.length} .xsl files to process`)
  const sources = stylesheets.map((stylesheet) => ({
    file: stylesheet,
    content: fs.readFileSync(stylesheet, 'utf-8'),
  }))
  const {corpus, defects} = validateXsls(sources, suppressions)
  const {expressions, defects: invalid} = validateXpaths(corpus, suppressions)
  defects.push(...invalid)
  for (const lint of LINTERS) {
    defects.push(...lint(corpus, suppressions))
  }
  for (const lint of EXPRESSION_LINTERS) {
    defects.push(...lint(expressions, suppressions))
  }
  for (const defect of defects) {
    const override = config.rules[defect.name]
    if (override === 'warning' || override === 'error') {
      defect.severity = override
    }
  }
  logger.info(`Processed files: ${stylesheets.length}`)
  if (defects.length > 0) {
    logger.info(`Defects found: ${defects.length}`)
    for (const defect of defects) {
      out[defect.severity](
        '%s(%d:%d) %s (%s)',
        defect.file,
        defect.line,
        defect.pos,
        defect.message,
        defect.name,
      )
    }
    const errors = defects.filter((defect) => defect.severity === 'error')
    const warnings = defects.filter((defect) => defect.severity === 'warning')
    if (
      errors.length > 0 ||
      (maxWarnings >= 0 && warnings.length > maxWarnings)
    ) {
      process.exit(1)
    }
  } else {
    logger.info(`No defects found`)
  }
}

module.exports = xslint
