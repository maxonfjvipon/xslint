/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const safe = require('colors/safe');

/**
 * Stdout.
 * @type {{
 *  debug: function(msg: String, ...args: any)
 *  info: function(msg: String, ...args: any)
 *  warn: function(msg: String, ...args: any)
 *  warning: function(msg: String, ...args: any)
 *  error: function(msg: String, ...args: any)
 * }}
 */
const stdout = {
  debug: (msg, ...args) => {
    console.log(`${safe.gray('[DEBUG]')} ${msg}`, ...args)
  },
  info: (msg, ...args) => {
    console.log(`${safe.blue('[INFO]')} ${msg}`, ...args)
  },
  warn: (msg, ...args) => {
    console.log(`${safe.yellow('[WARNING]')} ${msg}`, ...args)
  },
  warning: (msg, ...args) => {
    stdout.warn(msg, ...args)
  },
  error: (msg, ...args) => {
    console.log(`${safe.red('[ERROR]')} ${msg}`, ...args)
  }
}

module.exports = stdout
