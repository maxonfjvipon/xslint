/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const safe = require('colors/safe')

/**
 * Leveled, prefixed writer over a sink. The diagnostics (defects) and the
 * operational logs share this formatting but not their stream: defects go to
 * stdout, logs to stderr.
 * @param {function(string, ...*): void} sink - Where a formatted line goes
 * @return {{
 *  debug: function(string, ...*): void,
 *  info: function(string, ...*): void,
 *  warn: function(string, ...*): void,
 *  warning: function(string, ...*): void,
 *  error: function(string, ...*): void
 * }} - Writer bound to the sink
 */
const writer = function(sink) {
  const write = {
    debug: (msg, ...args) => sink(`${safe.gray('[DEBUG]')} ${msg}`, ...args),
    info: (msg, ...args) => sink(`${safe.blue('[INFO]')} ${msg}`, ...args),
    warn: (msg, ...args) => sink(`${safe.yellow('[WARNING]')} ${msg}`, ...args),
    warning: (msg, ...args) => write.warn(msg, ...args),
    error: (msg, ...args) => sink(`${safe.red('[ERROR]')} ${msg}`, ...args),
  }
  return write
}

module.exports = {
  out: writer((msg, ...args) => console.log(msg, ...args)),
  err: writer((msg, ...args) => console.error(msg, ...args)),
}
