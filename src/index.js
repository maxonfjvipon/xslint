#! /usr/bin/env node
/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {program} = require('commander')
const version = require('./version')
const xslint = require('./xslint')
const {levels} = require('./logger')

program
  .name('xslint')
  .usage('path [options]')
  .summary('XSL Linter')
  .description('XLS Linter (' + version.what + ' built on ' + version.when + ')')
  .version(version.what, '-v, --version', 'Output the version number')
  .helpOption('-?, --help', 'Print this help information')
  .option('--log-level <level>', 'Set log level', levels.INFO)
  .argument('[path]', 'path to file or directory to process', '.')
  .action((path) => {
    xslint(path, program.opts())
  })

try {
  program.parse(process.argv)
} catch (e) {
  console.error(e.message)
  console.debug(e.stack)
  process.exit(1)
}
