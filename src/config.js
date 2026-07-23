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
 * Top-level keys the configuration understands. Anything else is a typo worth
 * reporting rather than silently ignoring.
 * @type {Array.<string>}
 */
const KEYS = ['rules', 'exclude', 'max-warnings', 'log-level', 'quiet']

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
 * reporting any unknown top-level key and any rule graded to an unknown
 * severity rather than dropping them silently.
 * @param {object|null} raw - Parsed YAML, or null when there is no file
 * @return {{rules: object, exclude: Array.<string>, maxWarnings: number|null,
 *  logLevel: string|null, quiet: boolean|null}} - Normalized configuration
 */
const normalized = function(raw) {
  for (const key of Object.keys(raw || {})) {
    if (!KEYS.includes(key)) {
      logger.warn(`Unknown key '${key}' in ${NAME}`)
    }
  }
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
    logLevel: raw && Object.hasOwn(raw, 'log-level') ? raw['log-level'] : null,
    quiet: raw && Object.hasOwn(raw, 'quiet') ? raw.quiet : null,
  }
}

/**
 * Resolve the configuration: the file named by '--config' when given, otherwise
 * the nearest '.xslint.yml' from the working directory upward, otherwise the
 * empty defaults so that no file means the previous behaviour. The 'base' is
 * the directory the glob-based settings resolve against — where the file lives,
 * or the search origin when there is no file.
 * @param {string|undefined} explicit - Path from '--config', if any
 * @param {string} from - Directory the search starts in
 * @return {{rules: object, exclude: Array.<string>, maxWarnings: number|null,
 *  logLevel: string|null, quiet: boolean|null, base: string}} - Configuration
 */
const configFrom = function(explicit, from = process.cwd()) {
  const file = explicit ? path.resolve(from, explicit) : located(from)
  let raw = null
  if (file) {
    raw = yaml.parsedFromFile(file)
    logger.debug(`Configuration loaded from ${file}`)
  }
  return {...normalized(raw), base: file ? path.dirname(file) : from}
}

module.exports = {
  configFrom,
}
