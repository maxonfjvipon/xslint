/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const path = require('path')
const {execSync} = require('child_process')
const os = require('os')

/**
 * Execute JS file with node.
 *
 * @param {String} js - JS file to execute
 * @param {Array.<String>} args - Arguments
 * @param {boolean} print - Capture logs or not
 * @return {string} Stdout
 */
const execNode = function(js , args, print) {
  try {
    return execSync(
      `${js} ${args.join(' ')}`,
      {
        timeout: 120000,
        windowsHide: true,
        stdio: print ? null : 'ignore'
      }
    ).toString()
  } catch (ex) {
    console.debug(ex.stdout.toString())
    throw ex
  }
}

/**
 * Helper to run xslint command line tool.
 *
 * @param {Array.<string>} args - Array of args
 * @param {Boolean} print - Capture logs
 * @return {String} Stdout
 */
const runXslint = function(args, print = true) {
  return execNode(`node ${path.resolve('./src/index.js')}`, args, print)
};

const runXcop = function(args, print = true) {
  return execNode(`xcop`, args, print)
};

/**
 * Helper to check if command is available in the system.
 *
 * @param {String} cmd - Command
 * @param {Boolean} print - Capture logs
 * @return {Boolean} - Result
 */
const cmdAvailable = function(cmd, print = true) {
  try {
    const input = os.platform() === 'win32' ? `where` : `which`
      execNode(`${input}`, cmd, print)
      return true
  } catch (ex) {
    return false
  }
};

module.exports = {
  runXslint,
  runXcop,
  cmdAvailable,
}
