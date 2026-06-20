/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const stdout = require('./stdout')

/**
 * Log levels.
 * @type {{ERROR: string, INFO: string, DEBUG: string, WARN: string}}
 */
const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  WARN: 'warn',
  ERROR: 'error',
}

/**
 * Log levels as numbers.
 * @type {{[p: string]: number}}
 */
const LEVELS = {
  [LOG_LEVELS.DEBUG]: 0,
  [LOG_LEVELS.INFO]: 1,
  [LOG_LEVELS.WARNING]: 2,
  [LOG_LEVELS.WARN]: 2,
  [LOG_LEVELS.ERROR]: 3,
}

let currentLevel = LEVELS[LOG_LEVELS.INFO]

/**
 * Logger.
 * @type {{
 *  debug: function(string, ...*): void,
 *  info: function(string, ...*): void,
 *  warn: function(string, ...*): void,
 *  error: function(string, ...*): void,
 *  setLevel: function(string): void
 * }}
 */
const logger = {
  debug: (msg, ...args) => {
    if (currentLevel <= LEVELS[LOG_LEVELS.DEBUG]) {
      stdout.debug(msg, ...args)
    }
  },
  info: (msg, ...args) => {
    if (currentLevel <= LEVELS[LOG_LEVELS.INFO]) {
      stdout.info(msg, ...args)
    }
  },
  warn: (msg, ...args) => {
    if (currentLevel <= LEVELS[LOG_LEVELS.WARNING]) {
      stdout.warn(msg, ...args)
    }
  },
  error: (msg, ...args) => {
    if (currentLevel <= LEVELS[LOG_LEVELS.ERROR]) {
      stdout.error(msg, ...args)
    }
  },
  setLevel: (level) => {
    level = level.toLowerCase()
    if (!Object.hasOwn(LEVELS, level)) {
      logger.warn(
        [
          'The incorrect option --log-level provided: "%s".',
          'Possible options are %s. The default log level "info" is set',
        ].join(' '),
        level,
        Object.values(LOG_LEVELS).map((lvl) => `"${lvl}"`).join(', '),
      )
    } else {
      currentLevel = LEVELS[level]
      logger.debug(`Log level set to '${level}'`)
    }
  },
}

module.exports = {
  logger,
  levels: LOG_LEVELS,
}
