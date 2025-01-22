/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2025 Max Trunnikov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const path = require('path')
const fs = require('fs')
const {allFilesFrom} = require('./helpers')
const {lint_by_xpath} = require('./xpath-linter')
const xml = require('./xml')

/**
 * Linters.
 * @type {Array.<function(xsl: String): Array.<Object>>}
 */
const LINTERS = [
  lint_by_xpath,
]

/**
 * Returns all .xsl files paths depending on provided path.
 * @param {String} pth - Path to certain file or directory where .xsl should be placed
 * @return {Array.<String>} - Array of .xsl files paths
 */
const xsls = function(pth) {
  let files
  if (fs.statSync(pth).isDirectory()) {
    files = allFilesFrom(pth)
  } else {
    files = [pth]
  }
  return files.filter((file) => file.endsWith('.xsl'))
}

const xslint = function(pth, options) {
  const stylesheets = xsls(path.resolve(process.cwd(), pth))
  console.debug(`Found ${stylesheets.length} .xsl files to process`)
  const errors = []
  for (const stylesheet of stylesheets) {
    let xsl
    try {
      xsl = xml.parsedFromFile(stylesheet)
    } catch (err) {
      throw err
    }
    for (const lint of LINTERS) {
      errors.push(lint(xsl))
    }
  }
}

module.exports = xslint;
