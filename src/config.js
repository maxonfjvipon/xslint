/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const fs = require('fs')
const path = require('node:path')
const {yaml} = require('./helpers')
const {logger} = require('./logger')

/**
 * Name of the project configuration file.
 * @type {string}
 */
const NAME = '.xslint.yml'

/**
 * Severities a rule may be re-graded to, plus 'off' to disable it.
 * @type {Array.<string>}
 */
const SEVERITIES = ['off', 'warning', 'error']

/**
 * Nearest configuration file, searching from given directory up to the root.
 * @param {string} from - Directory to start the search in
 * @return {string|null} - Path of the found file, or null when none exists
 */
const located = function(from) {
  let dir = from
  let found = null
  while (!found) {
    const candidate = path.join(dir, NAME)
    if (fs.existsSync(candidate)) {
      found = candidate
    } else if (path.dirname(dir) === dir) {
      break
    } else {
      dir = path.dirname(dir)
    }
  }
  return found
}

/**
 * Normalize the parsed YAML into the configuration the linter consumes,
 * dropping and reporting any rule graded to an unknown severity.
 * @param {object|null} raw - Parsed YAML, or null when there is no file
 * @return {{rules: object, exclude: Array.<string>, maxWarnings: number|null}}
 *  - Normalized configuration
 */
const normalized = function(raw) {
  const rules = {}
  for (const [name, severity] of Object.entries(raw && raw.rules || {})) {
    if (SEVERITIES.includes(severity)) {
      rules[name] = severity
    } else {
      logger.warn(
        `Invalid severity '${severity}' for rule '${name}' in ${NAME}, ` +
        `use one of ${SEVERITIES.join(', ')}`,
      )
    }
  }
  return {
    rules: rules,
    exclude: raw && Array.isArray(raw.exclude) ? raw.exclude : [],
    maxWarnings: raw && Object.hasOwn(raw, 'max-warnings') ?
      raw['max-warnings'] : null,
  }
}

/**
 * Resolve the configuration: the file named by '--config' when given, otherwise
 * the nearest '.xslint.yml' from the working directory upward, otherwise the
 * empty defaults so that no file means the previous behaviour.
 * @param {string|undefined} explicit - Path from '--config', if any
 * @param {string} from - Directory the search starts in
 * @return {{rules: object, exclude: Array.<string>, maxWarnings: number|null}}
 *  - Normalized configuration
 */
const configFrom = function(explicit, from = process.cwd()) {
  const file = explicit ? path.resolve(from, explicit) : located(from)
  let raw = null
  if (file) {
    raw = yaml.parsedFromFile(file)
    logger.debug(`Configuration loaded from ${file}`)
  }
  return normalized(raw)
}

module.exports = {
  configFrom,
}
