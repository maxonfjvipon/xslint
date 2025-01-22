/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2025 Max Trunnikov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const stdout = require('./stdout');

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
};

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

let current_level = LEVELS[LOG_LEVELS.INFO]

/**
 * Logger.
 * @type {{
 *  debug: function(msg: String, ...args: any)
 *  info: function(msg: String, ...args: any)
 *  warn: function(msg: String, ...args: any)
 *  error: function(msg: String, ...args: any)
 *  setLevel: function(level: string)
 * }}
 */
const logger = {
  debug: (msg, ...args) => {
    if (current_level <= LEVELS[LOG_LEVELS.DEBUG]) {
      stdout.debug(msg, ...args)
    }
  },
  info: (msg, ...args) => {
    if (current_level <= LEVELS[LOG_LEVELS.INFO]) {
      stdout.info(msg, ...args)
    }
  },
  warn: (msg, ...args) => {
    if (current_level <= LEVELS[LOG_LEVELS.WARNING]) {
      stdout.warn(msg, ...args)
    }
  },
  error: (msg, ...args) => {
    if (current_level <= LEVELS[LOG_LEVELS.ERROR]) {
      stdout.error(msg, ...args)
    }
  },
  setLevel: (level) => {
    level = level.toLowerCase()
    if (!Object.hasOwn(LEVELS, level)) {
      logger.warn(
        [
          'The incorrect option --log-level provided: "%s".',
          'Possible options are %s. The default log level "info" is set'
        ].join(' '),
        level,
        Object.values(LOG_LEVELS).map((lvl) => `"${lvl}"`).join(', ')
      )
    } else {
      current_level = LEVELS[level]
      logger.debug(`Log level set to '${level}'`)
    }
  }
}

module.exports = {
  logger,
  levels: LOG_LEVELS,
}
