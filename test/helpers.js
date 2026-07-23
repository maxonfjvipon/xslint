/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const path = require('path')
const {execSync} = require('child_process')
const os = require('os')

/**
 * Run the console command
 * @param {string} command - Console Command
 * @param {Array.<string>} args - Arguments
 * @param {boolean} print - Capture logs or not
 * @return {string} Stdout
 */
const execCmd = function(command, args, print) {
  return execSync(
    `${command} ${args.join(' ')}`,
    {
      timeout: 120000,
      windowsHide: true,
      stdio: print ? null : 'ignore',
    },
  ).toString()
}

/**
 * Helper to run xslint command line tool.
 * @param {Array.<string>} args - Array of args
 * @param {boolean} print - Capture logs
 * @return {string} Stdout
 */
const runXslint = function(args, print = true) {
  try {
    return execCmd(`node ${path.resolve('./src/index.js')}`, args, print)
  } catch (ex) {
    return ex.stdout.toString()
  }
}

/**
 * Helper to run xslint and report its exit code instead of its output.
 * @param {Array.<string>} args - Array of args
 * @return {number} Exit code
 */
const xslintStatus = function(args) {
  let status = 0
  try {
    execCmd(`node ${path.resolve('./src/index.js')}`, args, true)
  } catch (ex) {
    status = ex.status
  }
  return status
}

/**
 * Helper to run xcop command line tool.
 * @param {string} arg - arg
 * @param {boolean} print - Capture logs
 * @return {string} Stdout
 */
const runXcop = function(arg, print = true) {
  return execCmd('xcop', [arg], print)
}

/**
 * Helper to check if command is available in the system.
 * @param {string} cmd - Command
 * @param {boolean} print - Capture logs
 * @return {boolean} - Result
 */
const cmdAvailable = function(cmd, print = true) {
  try {
    const command = os.platform === 'win32' ? 'where' : 'which'
    execCmd(command, [cmd], print)
    return true
  } catch {
    return false
  }
}

module.exports = {
  runXslint,
  xslintStatus,
  runXcop,
  cmdAvailable,
}
