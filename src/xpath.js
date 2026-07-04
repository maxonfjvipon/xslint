/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {
  evaluateXPath, evaluateXPathToNodes, evaluateXPathToStrings,
  compileXPathToJavaScript, registerCustomXPathFunction,
} = require('fontoxpath')

/**
 * Namespace URI of the xslint custom XPath functions.
 * @type {string}
 */
const FUNCTIONS = 'https://github.com/maxonfjvipon/xslint'

/**
 * Standard prefixes bound in every Xpath expression. When validating, an
 * unknown prefix must not be mistaken for a syntax error, so these resolve to
 * their real URIs and any other prefix resolves to a placeholder.
 * @type {object}
 */
const STANDARD = {
  'xsl': 'http://www.w3.org/1999/XSL/Transform',
  'xs': 'http://www.w3.org/2001/XMLSchema',
  'fn': 'http://www.w3.org/2005/xpath-functions',
  'map': 'http://www.w3.org/2005/xpath-functions/map',
  'array': 'http://www.w3.org/2005/xpath-functions/array',
  'math': 'http://www.w3.org/2005/xpath-functions/math',
}

/**
 * Prefixes.
 * @type {{xsl: string, xslint: string}}
 */
const PREFIXES = {
  'xsl': STANDARD.xsl,
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

/**
 * Whether given Xpath expression is syntactically valid. The same engine that
 * runs the rules parses it, so an expression is valid here exactly when the
 * processor would accept it. Every prefix resolves, isolating syntax from
 * unresolved-prefix errors.
 * @param {string} xpath - Xpath expression
 * @return {boolean} - True when the expression parses
 */
const isValid = function(xpath) {
  let parses = true
  try {
    compileXPathToJavaScript(xpath, evaluateXPath.ALL_RESULTS_TYPE, {
      namespaceResolver: (prefix) =>
        Object.hasOwn(STANDARD, prefix) ? STANDARD[prefix] : FUNCTIONS,
    })
  } catch {
    parses = false
  }
  return parses
}

module.exports = {
  nodes,
  strings,
  isValid,
}
