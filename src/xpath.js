/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {
  evaluateXPathToNodes, evaluateXPathToStrings, registerCustomXPathFunction,
} = require('fontoxpath')

/**
 * Namespace URI of the xslint custom XPath functions.
 * @type {string}
 */
const FUNCTIONS = 'https://github.com/maxonfjvipon/xslint'

/**
 * Prefixes.
 * @type {{xsl: string, xslint: string}}
 */
const PREFIXES = {
  'xsl': 'http://www.w3.org/1999/XSL/Transform',
  'xslint': FUNCTIONS,
}

/**
 * In-scope namespace prefixes of given node and its ancestors. fontoxpath
 * hides namespace declarations, so this exposes them to the rules.
 * @param {object} context - Dynamic context, unused
 * @param {Node} node - Context node
 * @return {Array.<string>} - Declared namespace prefixes
 */
const inScopePrefixes = function(context, node) {
  const prefixes = new Set(['xml'])
  for (let element = node; element; element = element.parentNode) {
    for (const attribute of Array.from(element.attributes || [])) {
      if (attribute.nodeName.startsWith('xmlns:')) {
        prefixes.add(attribute.nodeName.slice('xmlns:'.length))
      }
    }
  }
  return Array.from(prefixes)
}

registerCustomXPathFunction(
  {namespaceURI: FUNCTIONS, localName: 'in-scope-prefixes'},
  ['node()'], 'xs:string*', inScopePrefixes,
)

/**
 * Resolve prefix.
 * @param {string} prefix - Prefix itself
 * @return {null | string} - Resolved prefix
 */
const resolvePrefix = function(prefix) {
  let spec = null
  if (Object.hasOwn(PREFIXES, prefix)) {
    spec = PREFIXES[prefix]
  }
  return spec
}

/**
 * Nodes matching given Xpath on given XSL.
 * @param {Document} xsl - XSL document parsed as {@link Document}
 * @param {string} xpath - Xpath
 * @return {Array.<Node>} - Matching nodes in the order defined by the XPath
 */
const nodes = function(xsl, xpath) {
  return evaluateXPathToNodes(
    xpath, xsl, null, {}, {namespaceResolver: resolvePrefix},
  )
}

/**
 * String values matching given Xpath on given XSL.
 * @param {Document} xsl - XSL document parsed as {@link Document}
 * @param {string} xpath - Xpath
 * @return {Array.<string>} - Matching string values
 */
const strings = function(xsl, xpath) {
  return evaluateXPathToStrings(
    xpath, xsl, null, {}, {namespaceResolver: resolvePrefix},
  )
}

module.exports = {
  nodes,
  strings,
}
