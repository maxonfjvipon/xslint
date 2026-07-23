/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const path = require('path')
const {execSync, spawnSync} = require('child_process')
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
 * Run xslint in a child process, node warnings silenced so only the tool's own
 * output remains.
 * @param {Array.<string>} args - Array of args
 * @return {import('child_process').SpawnSyncReturns<string>} - Result
 */
const spawnXslint = function(args) {
  return spawnSync(
    'node',
    [path.resolve('./src/index.js'), ...args],
    {
      timeout: 120000,
      windowsHide: true,
      encoding: 'utf-8',
      env: {...process.env, NODE_NO_WARNINGS: '1'},
    },
  )
}

/**
 * Helper to run xslint, returning its stdout and stderr together.
 * @param {Array.<string>} args - Array of args
 * @return {string} Combined stdout and stderr
 */
const runXslint = function(args) {
  const result = spawnXslint(args)
  return `${result.stdout}${result.stderr}`
}

/**
 * Helper to run xslint and report its exit code.
 * @param {Array.<string>} args - Array of args
 * @return {number} Exit code
 */
const xslintStatus = function(args) {
  return spawnXslint(args).status
}

/**
 * Helper to run xslint, keeping stdout and stderr apart.
 * @param {Array.<string>} args - Array of args
 * @return {{stdout: string, stderr: string}} Streams
 */
const xslintStreams = function(args) {
  const result = spawnXslint(args)
  return {stdout: result.stdout, stderr: result.stderr}
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
  xslintStreams,
  runXcop,
  cmdAvailable,
}
