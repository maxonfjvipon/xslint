/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {allFilesFrom} = require('../src/helpers')
const path = require('path')
const assert = require('assert')
const {runXcop, cmdAvailable} = require('./helpers')
const fs = require('fs')

/**
 * Yaml test packs.
 * @type {Array<string>}
 */
const MOTIVES = allFilesFrom(path.resolve(__dirname, '../src/resources/motives'))

describe('xcop motives check', function() {
  MOTIVES.forEach((motive) => {
    const lines = fs.readFileSync(`${motive}`, 'utf8').split(/\r?\n/)
    if (cmdAvailable('xcop')) {
      it(`should find no errors in xsl in ${path.basename(motive)}`, function() {
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('```xsl')) {
            const xsl = path.resolve(__dirname, 'temp-motives-check.xsl')
            fs.writeFileSync(xsl, '<?xml version="1.0"?>\n')
            while (i+1<lines.length && !lines[i+1].startsWith('```')) {
              fs.appendFileSync(xsl, lines[i+1] + '\n')
              i++
            }
            const stdout = runXcop(xsl)
            assert.ok(stdout.includes(`${xsl} looks good`))
            fs.unlinkSync(xsl)
          }
        }
      })
    }
  })
})
