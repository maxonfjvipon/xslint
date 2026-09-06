/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

/*
 * The fontoxpath environment, and the one function this project adds to it.
 * `xslint:normalize-space` is what every selector of ours spells where XPath
 * would say `normalize-space`, because fontoxpath's own is JavaScript's: it
 * trims and collapses on `\s`, so a no-break space, a line separator and an
 * em space are gaps to it, where XPath defines the function over the four
 * characters of XML's `S` alone — the genre of the `\s` in #643, one
 * function further in.
 *
 * Seven selectors spell it, and six of them were wrong before #881, in both
 * directions at once. Three under-reported, the wider gap swallowing content
 * a stylesheet emits: `text-outside-xsl-text` read 29 nodes of the three
 * corpora as blank, `variable-or-param-with-select-and-content` missed an
 * XTSE0620 Saxon refuses to load, and `malformed-version-in-stylesheet` let
 * a `version="&#xA0;2.0"` pass as a number. Three over-reported, calling a
 * character nothing at all: `empty-content-in-instructions` called an
 * `xsl:if` empty that emits one, and `blank-nested-if` and
 * `setting-value-of-variable-incorrectly` advised a collapse that would have
 * dropped it. All three are report-only, so what the wider gap cost was a
 * misleading report and never a corrupted file. The 29 nodes are #881's
 * own measurement over the three corpora the README advertises.
 *
 * The seventh was already right, and that is the part worth keeping. Its
 * predicate is one `src/predicates.js` serves off the shared walk, whose
 * `normalized` reads the four characters XPath defines — so one tree held
 * both answers to the same question, and which one a check got depended on
 * whether the optimiser had reached it. A served answer that differs from
 * the engine's is worse than a slow one, however correct it is on its own,
 * which is why the vocabulary refuses a bare `normalize-space` outright and
 * serves only the `xslint:` spelling. Registering the function is what lets
 * it: the walk and the engine now read the same four characters.
 */

const {
  evaluateXPath, evaluateXPathToBoolean, evaluateXPathToNodes,
  evaluateXPathToStrings,
  compileXPathToJavaScript, registerCustomXPathFunction,
} = require('fontoxpath')
const {normalized} = require('./tokens')

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
 * `xslint:normalize-space`, which every selector of ours spells where XPath
 * would say `normalize-space`. The engine's own trims and collapses on `\s`,
 * so a no-break space or an em space is a gap to it, where XPath defines the
 * function over XML's four `S` characters alone — so a selector asking the
 * engine read a wider gap than the walk answering it (#643, #881).
 */
registerCustomXPathFunction(
  {namespaceURI: FUNCTIONS, localName: 'normalize-space'},
  ['xs:string?'], 'xs:string',
  (context, text) => normalized(text ?? ''),
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
 * A thrown compile failure that carries a W3C error code, as opposed to a
 * parse failure. The engine reports a syntax error as "<position>: <source>",
 * but a static or type error as a QName-shaped code such as XPTY0004 or
 * XPST0017. Only the former means the expression is genuinely malformed.
 * @type {RegExp}
 */
const CODED = /^[A-Z]{4}\d{4}/

/**
 * Whether the engine compiles the expression, counting a static-type complaint
 * as success: the engine is XPath 3.1, so it rejects the numeric coercion a
 * 1.0 stylesheet leans on, which is a dialect mismatch and not a syntax error.
 * No verdict of a run passes through here (#732) — it is the suite's second
 * opinion, and may stay strict (#738).
 * @param {string} xpath - Xpath expression
 * @return {boolean} - True when it compiles or fails only on a type
 */
const compiles = function(xpath) {
  let ok = true
  try {
    compileXPathToJavaScript(xpath, evaluateXPath.ALL_RESULTS_TYPE, {
      namespaceResolver: (prefix) => {
        let uri = FUNCTIONS
        if (Object.hasOwn(STANDARD, prefix)) {
          uri = STANDARD[prefix]
        }
        return uri
      },
    })
  } catch (err) {
    ok = CODED.test(String(err.message))
  }
  return ok
}

/**
 * Whether the node satisfies the expression, its effective boolean value taken
 * with that node as the context item. It is how a predicate is asked of one
 * candidate the index handed over, where the selector it came from would have
 * asked the engine to find the candidate as well (#784).
 * @param {Node} node - The node to judge
 * @param {string} xpath - Xpath to take the truth of
 * @return {boolean} - Whether it holds there
 */
const satisfies = function(node, xpath) {
  return evaluateXPathToBoolean(
    xpath, node, null, {}, {namespaceResolver: resolvePrefix},
  )
}

module.exports = {
  PREFIXES,
  nodes,
  satisfies,
  strings,
  compiles,
}
