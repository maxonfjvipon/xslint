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

const {evaluateXPathToNodes} = require('fontoxpath')

/**
 * Prefixes.
 * @type {{xsl: string}}
 */
const PREFIXES = {
  'xsl': 'http://www.w3.org/1999/XSL/Transform'
}

/**
 * Resolve prefix.
 * @param {String} prefix - Prefix itself
 * @return {null|String} - Resolved prefix
 */
const resolvePrefix = function(prefix) {
  let spec = null
  if (Object.hasOwn(PREFIXES, prefix)) {
    spec = PREFIXES[prefix]
  }
  return spec
};

/**
 * Evaluate Xpath on given XSL and return found nodes.
 * @param {Document} xsl - XSL document parsed as {@link Document}
 * @param {String} xpath - Xpath
 * @return {Node[]} - All matching Nodes, in the order defined by the XPath.
 */
const evaluate_xpath = function(xsl, xpath) {
  return evaluateXPathToNodes(
    xpath, xsl, null, {}, {namespaceResolver: resolvePrefix}
  )
}

/**
 * Lint given XSL by Xpath packs.
 * @param {Document} xsl - XSL document parsed as {@link Document}
 */
const lint_by_xpath = function(xsl) {

}

module.exports = {
  lint_by_xpath,
  evaluate_xpath,
}
