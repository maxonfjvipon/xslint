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

const fs = require('fs')
const {DOMParser} = require('xmldom')

/**
 * XML Parser
 * @type {DOMParser}
 */
const parser = new DOMParser()

/**
 * Parse XML file by given path.
 * @param {string} path - Path to XML file
 * @return {any} - Parsed XML structure ready for XSL transformations or XPATH checking
 */
const fromFile = function(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`XML file ${path} does not exist, can't parse`)
  }
  if (fs.statSync(path).isDirectory()) {
    throw new Error(`XML file ${path} is directory, can't parse`)
  }
  return fromString(fs.readFileSync(path, 'utf-8'))
}

/**
 * Parse XML from string.
 * @param {String} str - XML as string
 * @return {Document}
 */
const fromString = function(str) {
  let parsed
  try {
    parsed = parser.parseFromString(str, 'text/xml')
  } catch (err) {
    throw new Error(`Couldn't parse XML:\n${str}\n\nCause: ${err.message}`)
  }
  return parsed
}

module.exports = {
  parsedFromFile: fromFile,
  parsedFromString: fromString
};
