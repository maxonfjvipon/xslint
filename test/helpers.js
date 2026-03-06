/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const path = require('path')
const {execSync} = require('child_process')
const os = require('os')

/**
 * Run the console command
 *
 * @param {String} command - Console Command
 * @param {Array.<String>} args - Arguments
 * @param {boolean} print - Capture logs or not
 * @return {string} Stdout
 */
const execCmd = function(command, args, print) {
  try {
    return execSync(
      `${command} ${args.join(' ')}`,
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
  try {
    return execCmd(`node ${path.resolve('./src/index.js')}`, args, print)
  } catch (ex) {
    return ex.stdout.toString()
  }
};

/**
 * Helper to run xslint command line tool with exclude options .
 *
 * @param {Array.<string>} args - Array of args
 * @param {Array.<string>} excludes - Array of excludes
 * @param {Boolean} print - Capture logs
 * @return {String} Stdout
 */
const runXslintWithExcludes = function(args, excludes, print = true) {
  let options='';
  excludes.forEach(exclude => {
    options = `${options} --exclude=${exclude}`
  })
  try {
    return execCmd(`node ${path.resolve('./src/index.js')} ${options}`, args, print)
  } catch (ex) {
    console.debug(ex.stdout.toString())
    return ex.stdout.toString()
  }
};

/**
 * Helper to run xcop command line tool.
 *
 * @param {String} arg - arg
 * @param {Boolean} print - Capture logs
 * @return {String} Stdout
 */
const runXcop = function(arg, print = true) {
  return execCmd('xcop', [arg], print)
};

/**
 * Helper to check if command is available in the system.
 *
 * @param {String} cmd - Command
 * @param {Boolean} print - Capture logs
 * @return {boolean} - Result
 */
const cmdAvailable = function(cmd, print = true) {
  try {
    const command = os.platform === 'win32' ? 'where' : 'which'
    execCmd(command, [cmd], print)
    return true
  } catch (ex) {
    return false
  }
};

module.exports = {
  runXslint,
  runXcop,
  cmdAvailable,
  runXslintWithExcludes,
}
