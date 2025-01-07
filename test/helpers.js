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
  return execNode(path.resolve('./src/xslint.js'), args, print)
};

module.exports = runXslint
