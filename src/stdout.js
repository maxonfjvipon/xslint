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

const safe = require('colors/safe');

/**
 * Stdout.
 * @type {{
 *  debug: function(msg: String, ...args: any)
 *  info: function(msg: String, ...args: any)
 *  warn: function(msg: String, ...args: any)
 *  warning: function(msg: String, ...args: any)
 *  error: function(msg: String, ...args: any)
 * }}
 */
const stdout = {
  debug: (msg, ...args) => {
    console.log(`${safe.gray('[DEBUG]')} ${msg}`, ...args)
  },
  info: (msg, ...args) => {
    console.log(`${safe.blue('[INFO]')} ${msg}`, ...args)
  },
  warn: (msg, ...args) => {
    console.log(`${safe.yellow('[WARNING]')} ${msg}`, ...args)
  },
  warning: (msg, ...args) => {
    stdout.warn(msg, ...args)
  },
  error: (msg, ...args) => {
    console.log(`${safe.red('[ERROR]')} ${msg}`, ...args)
  }
}

module.exports = stdout
