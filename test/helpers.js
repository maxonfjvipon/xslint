/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const path = require('path')
const {execSync} = require('child_process')

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
 * @param {Array.<string>} arg - Array of args
 * @param {Boolean} print - Capture logs
 * @return {String} Stdout
 */
const runXcope = function(arg, print = true) {
    try {
      return execSync(
        `echo "${arg}" | xcope`,
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

module.exports = runXslint
