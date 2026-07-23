/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

/**
 * Inline suppression directives, written as XML comments, and the scope each
 * one covers. Rule names are optional and space-separated; with none, the
 * directive covers every rule at its location.
 * @type {RegExp}
 */
const DIRECTIVE =
  /<!--\s*xslint-(disable-file|disable-next-line|disable-line)([a-z0-9\s-]*)-->/g

/**
 * Inline directives found in a stylesheet's raw text, each with the line it
 * sits on and the rule names it names.
 * @param {string} content - Raw stylesheet text
 * @return {Array.<{type: string, line: number, names: Array.<string>}>} -
 *  Directives in the order they appear
 */
const directivesFrom = function(content) {
  const directives = []
  for (const match of content.matchAll(DIRECTIVE)) {
    directives.push({
      type: match[1],
      line: content.slice(0, match.index).split('\n').length,
      names: match[2].trim().split(/\s+/).filter((name) => name.length > 0),
    })
  }
  return directives
}

/**
 * Whether any directive suppresses given defect. A directive with no names
 * covers every rule; otherwise it covers only the ones it names. 'disable-file'
 * covers the whole file, 'disable-next-line' the line after the comment, and
 * 'disable-line' the comment's own line.
 * @param {Array.<{type: string, line: number, names: Array.<string>}>}
 *  directives - Directives from the defect's file
 * @param {{name: string, line: number}} defect - Defect to test
 * @return {boolean} - True when a directive suppresses the defect
 */
const suppresses = function(directives, defect) {
  return directives.some((directive) => {
    if (directive.names.length > 0 && !directive.names.includes(defect.name)) {
      return false
    }
    if (directive.type === 'disable-file') {
      return true
    }
    if (directive.type === 'disable-next-line') {
      return defect.line === directive.line + 1
    }
    return defect.line === directive.line
  })
}

module.exports = {
  directivesFrom,
  suppresses,
}
