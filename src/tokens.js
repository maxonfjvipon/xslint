/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

/**
 * Token types a lexed expression is made of.
 * @type {
 * {STRING: string,
 * COMMENT: string,
 * WHITESPACE: string,
 * LPAREN: string,
 * RPAREN: string,
 * LBRACKET: string,
 * RBRACKET: string,
 * USER_FUNCTION: string,
 * OTHER: string}
 * }
 */
const TOKENS = {
  STRING: 'string',
  COMMENT: 'comment',
  WHITESPACE: 'whitespace',
  OPERATOR: 'operator',
  LPAREN: '(',
  RPAREN: ')',
  LBRACKET: '[',
  RBRACKET: ']',
  MULTI: '*',
  PLUS: '+',
  MINUS: '-',
  DIV: 'div',
  MOD: 'mod',
  PIPE: 'pipe',
  EQ: 'eq',
  NE: 'ne',
  LT: 'lt',
  GT: 'gt',
  LE: 'le',
  GE: 'ge',
  OR: 'or',
  LESS: '<',
  GREATER: '>',
  EQUAL: '=',
  NOT_EQUAL: '!=',
  LESS_EQUAL: '<=',
  GREAT_EQUAL: '>=',
  AND: 'and',
  IDIV: 'idiv',
  UNION: 'union',
  INSTANCE_OF: 'instance of',
  INTERSECT: 'intersect',
  EXCEPT: 'except',
  USER_FUNCTION: 'user_function',
  OTHER: 'other',
  CONCAT: '||',
}

/**
 * Characters XPath treats as insignificant whitespace.
 * @type {string}
 */
const WHITESPACE = ' \t\r\n'

/**
 * Quote characters that open a string literal.
 * @type {string}
 */
const QUOTES = '"\''

/**
 * Map single characters to a token.
 * @type {{[key: string]: string}}
 */
const SINGLE = {
  '(': TOKENS.LPAREN,
  ')': TOKENS.RPAREN,
  '[': TOKENS.LBRACKET,
  ']': TOKENS.RBRACKET,
  '+': TOKENS.PLUS,
  '-': TOKENS.MINUS,
  '*': TOKENS.MULTI,
  '=': TOKENS.EQUAL,
  '<': TOKENS.LESS,
  '>': TOKENS.GREATER,
  '|': TOKENS.PIPE,
}

/**
 * Map double characters to a token.
 * @type {{[key: string]: string}}
 */
const DOUBLE = {
  '!=': TOKENS.NOT_EQUAL,
  '<=': TOKENS.LESS_EQUAL,
  '>=': TOKENS.GREAT_EQUAL,
  'eq': TOKENS.EQ,
  'ne': TOKENS.NE,
  'lt': TOKENS.LT,
  'le': TOKENS.LE,
  'gt': TOKENS.GT,
  'ge': TOKENS.GE,
  '||': TOKENS.CONCAT,
  'or': TOKENS.OR,
}

/**
 * Map triple characters to a token.
 * @type {{[key: string]: string}}
 */
const TRIPLE = {
  'and': TOKENS.AND,
  'div': TOKENS.DIV,
  'mod': TOKENS.MOD,
}

/**
 * Map characters with more than 3 symbols to a token.
 * @type {{[key: string]: string}}
 */
const MORE = {
  'instance of': TOKENS.INSTANCE_OF,
  'intersect': TOKENS.INTERSECT,
  'except': TOKENS.EXCEPT,
  'union': TOKENS.UNION,
  'idiv': TOKENS.IDIV,
}

/**
 * Whether a comment opens at given offset.
 * @param {string} xpath - Xpath expression
 * @param {number} at - Offset to test
 * @return {boolean} - True when "(:" starts here
 */
const opensComment = function(xpath, at) {
  return xpath[at] === '(' && xpath[at + 1] === ':'
}

/**
 * Whether a user function opens at given offset.
 * @param {string} xpath - Xpath expression
 * @param {number} at - Offset to test
 * @return {string} - User function
 */
const opensUserFunction = function(xpath, at) {
  let func=''
  let colon = 0
  if (at<xpath.length && xpath[at].match(/[a-zA-Z]/)) {
    func += xpath[at]
    at++
    while (at<xpath.length && xpath[at].match(/[a-zA-Z0-9_:]/)) {
      if (xpath[at].match(/[a-zA-Z0-9_]/)) {
        func = func + xpath[at]
        at++
      } else {
        if (colon === 0) {
          func += xpath[at]
          at++
          colon++
        } else {
          func = ''
          break
        }
      }
    }
  }
  if (xpath[at] !== '(' || colon !== 1) func = ''
  return func
}

/**
 * Whether an element opens at given offset.
 * @param {string} xpath - Xpath expression
 * @param {number} at - Offset to test
 * @return {string} - token
 */
const opensMore = function(xpath, at) {
  let token = ''
  Object.keys(MORE).forEach((elem) => {
    if (xpath.slice(at, at + elem.length) === elem) {
      token = elem
    }
  })
  return token
}

/**
 * Offset just past the string literal opening at given quote. A doubled quote
 * inside the literal escapes the quote and does not end it.
 * @param {string} xpath - Xpath expression
 * @param {number} start - Offset of the opening quote
 * @return {number} - Offset just past the closing quote
 */
const afterString = function(xpath, start) {
  const quote = xpath[start]
  let at = start + 1
  while (at < xpath.length) {
    if (xpath[at] === quote && xpath[at + 1] === quote) {
      at += 2
    } else if (xpath[at] === quote) {
      at += 1
      break
    } else {
      at += 1
    }
  }
  return at
}

/**
 * Offset just past the comment opening at given offset. Comments nest, so an
 * inner "(:" must be balanced by its own ":)".
 * @param {string} xpath - Xpath expression
 * @param {number} start - Offset of the opening "(:"
 * @return {number} - Offset just past the closing ":)"
 */
const afterComment = function(xpath, start) {
  let at = start + 2
  let depth = 1
  while (at < xpath.length && depth > 0) {
    if (opensComment(xpath, at)) {
      depth += 1
      at += 2
    } else if (xpath[at] === ':' && xpath[at + 1] === ')') {
      depth -= 1
      at += 2
    } else {
      at += 1
    }
  }
  return at
}

/**
 * Offset just past the run of non-delimiter characters at given offset. The run
 * stops at a quote, whitespace, or comment opener so those start their own
 * token.
 * @param {string} xpath - Xpath expression
 * @param {number} start - Offset of the first character
 * @return {number} - Offset just past the run
 */
const afterOther = function(xpath, start) {
  let at = start
  while (
    at < xpath.length &&
    !QUOTES.includes(xpath[at]) &&
    !WHITESPACE.includes(xpath[at]) &&
    !SINGLE[xpath[at]] &&
    !DOUBLE[xpath.slice(at, at+2)] &&
    !TRIPLE[xpath.slice(at, at+3)] &&
    !opensMore(xpath, at) &&
    !opensComment(xpath, at) &&
    !opensUserFunction(xpath, at)
  ) {
    at += 1
  }
  return at
}

/**
 * Offset just past the whitespace run at given offset.
 * @param {string} xpath - Xpath expression
 * @param {number} start - Offset of the first whitespace character
 * @return {number} - Offset just past the run
 */
const afterWhitespace = function(xpath, start) {
  let at = start
  while (at < xpath.length && WHITESPACE.includes(xpath[at])) {
    at += 1
  }
  return at
}

/**
 * Split an XPath expression into positioned tokens, preserving whitespace and
 * comments so formatting checks can reason over the original text. Each token
 * carries its type, raw value, and the offset where it starts.
 * @param {string} xpath - Xpath expression
 * @return {Array.<{type: string, value: string, start: number}>} - Tokens
 */
const tokenized = function(xpath) {
  const tokens = []
  let at = 0
  while (at < xpath.length) {
    const start = at
    let type
    if (QUOTES.includes(xpath[at])) {
      type = TOKENS.STRING
      at = afterString(xpath, at)
    } else if (opensComment(xpath, at)) {
      type = TOKENS.COMMENT
      at = afterComment(xpath, at)
    } else if (WHITESPACE.includes(xpath[at])) {
      type = TOKENS.WHITESPACE
      at = afterWhitespace(xpath, at)
    } else if (opensMore(xpath, at)) {
      type = MORE[opensMore(xpath, at)]
      at+=opensMore(xpath, at).length
    } else if (TRIPLE[xpath.slice(at, at+3)]) {
      type = TRIPLE[xpath.slice(at, at+3)]
      at+=3
    } else if (DOUBLE[xpath.slice(at, at+2)]) {
      type = DOUBLE[xpath.slice(at, at+2)]
      at+=2
    } else if (SINGLE[xpath[at]]) {
      type = SINGLE[xpath[at]]
      at++
    } else if (opensUserFunction(xpath, at)) {
      type = TOKENS.USER_FUNCTION
      at+=opensUserFunction(xpath, at).length
    } else {
      type = TOKENS.OTHER
      at = afterOther(xpath, at)
    }
    tokens.push({type: type, value: xpath.slice(start, at), start: start})
  }
  return tokens
}

module.exports = {
  tokenized,
  TOKENS,
}
