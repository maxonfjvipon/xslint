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
const execNode = function(js, args, print) {
  try {
    return execSync(
      `node ${js} ${args.join(' ')}`,
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
  return execNode(path.resolve('./src/index.js'), args, print)
};

/**
 * Helper to run xcope command line tool.
 *
 * @param {Array.<string>} args - Array of xsl file's names
 * @param {Boolean} print - Capture logs
 * @return {String} Stdout
 */
const runXcop = function(args, print = true) {
  try {
    return execSync(
      `xcop ${args} `,
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
    let input;
    os.platform() === 'win32' ? input = `where ${cmd}` : input = `which ${cmd}`
    try {
      execSync(
        `${input}`,
        {
          timeout: 120000,
          windowsHide: true,
          stdio: print ? null : 'ignore'
        }).toString()
      return true
    } catch (ex) {
      console.debug(ex.stdout.toString())
      return false
    }
  } catch (ex) {
    console.debug(ex.stdout.toString())
    throw ex
  }
};

module.exports = {
  runXslint,
  runXcop,
  cmdAvailable,
}
