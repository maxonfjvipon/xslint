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
 * NUMBER: string,
 * LPAREN: string,
 * RPAREN: string,
 * LBRACKET: string,
 * RBRACKET: string,
 * CHILD: string,
 * PARENT: string,
 * SELF: string,
 * ATTRIBUTE: string,
 * DESCENDANT: string,
 * DESCENDANT_OR_SELF: string,
 * FOLLOWING: string,
 * FOLLOWING_SIBLING: string,
 * PRECEDING: string,
 * PRECEDING_SIBLING: string,
 * ANCESTOR: string,
 * ANCESTOR_OR_SELF: string,
 * NAMESPACE: string,
 * USER_FUNCTION: string,
 * MULTI: string,
 * PLUS: string,
 * MINUS: string,
 * DIV: string,
 * MOD: string,
 * PIPE: string,
 * EQ: string,
 * NE: string,
 * LT: string,
 * GT: string,
 * LE: string,
 * GE: string,
 * OR: string,
 * LESS: string,
 * GREATER: string,
 * EQUAL: string,
 * NOT_EQUAL: string,
 * LESS_EQUAL: string,
 * GREAT_EQUAL: string,
 * AND: string,
 * IDIV: string,
 * UNION: string,
 * INSTANCE_OF: string,
 * INTERSECT: string,
 * EXCEPT: string,
 * CONCAT: string,
 * NAME_TEST: string,
 * OTHER: string}
 * }
 */
const TOKENS = {
  STRING: 'string',
  COMMENT: 'comment',
  WHITESPACE: 'whitespace',
  NUMBER: 'number',
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
  CHILD: 'child',
  PARENT: 'parent',
  SELF: 'self',
  ATTRIBUTE: 'attribute',
  DESCENDANT: 'descendant',
  DESCENDANT_OR_SELF: 'descendant-or-self',
  FOLLOWING: 'following',
  FOLLOWING_SIBLING: 'following-sibling',
  PRECEDING: 'preceding',
  PRECEDING_SIBLING: 'preceding-sibling',
  ANCESTOR: 'ancestor',
  ANCESTOR_OR_SELF: 'ancestor-or-self',
  NAMESPACE: 'namespace',
  USER_FUNCTION: 'user_function',
  CONCAT: '||',
  FUNCTION: 'function',
  NAME_TEST: 'name-test',
  OTHER: 'other',
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
 * Numeric characters that are included in the numeric literal.
 * @type {string}
 */
const DIGIT = '0123456789'

/**
 * Map axes to a token.
 * @type {{[key: string]: string}}
 */
const AXES = {
  'child::': TOKENS.CHILD,
  'parent::': TOKENS.PARENT,
  'self::': TOKENS.SELF,
  'attribute::': TOKENS.ATTRIBUTE,
  'descendant::': TOKENS.DESCENDANT,
  'descendant-or-self::': TOKENS.DESCENDANT_OR_SELF,
  'following::': TOKENS.FOLLOWING,
  'following-sibling::': TOKENS.FOLLOWING_SIBLING,
  'preceding::': TOKENS.PRECEDING,
  'preceding-sibling::': TOKENS.PRECEDING_SIBLING,
  'ancestor::': TOKENS.ANCESTOR,
  'ancestor-or-self::': TOKENS.ANCESTOR_OR_SELF,
  'namespace::': TOKENS.NAMESPACE,
}

/**
 * Map bracket and paren characters to a token.
 * @type {{[key: string]: string}}
 */
const BRACKETS = {
  '(': TOKENS.LPAREN,
  ')': TOKENS.RPAREN,
  '[': TOKENS.LBRACKET,
  ']': TOKENS.RBRACKET,
}

/**
 * Map single characters to a token.
 * @type {{[key: string]: string}}
 */
const SINGLE = {
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
 * Whether an axis opens at given offset.
 * @param {string} xpath - Xpath expression
 * @param {number} at - Offset to test
 * @return {string} - Axis
 */
const opensAxis = function(xpath, at) {
  let axis = ''
  if (at<xpath.length && xpath[at].match(/[a-zA-Z]/)) {
    do {
      axis += xpath[at]
      at++
      if (xpath[at] === ':') {
        if (xpath[at+1] === ':') {
          axis += xpath.slice(at, at+2)
          at++
        } else {
          axis = ''
        }
        break
      }
    } while (at<xpath.length && xpath[at].match(/[a-zA-Z\-:]/))
  }
  if (!AXES[axis]) {
    axis=''
  }
  return axis
}

/**
 * Whether a number opens at given offset.
 * @param {string} xpath - Xpath expression
 * @param {number} at - Offset to test
 * @return {boolean} - True when digit or "." with digit starts here
 */
const opensNumber = function(xpath, at) {
  return DIGIT.includes(xpath[at]) || (xpath[at] === '.' && DIGIT.includes(xpath[at+1]))
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
    if (xpath[at-1] === ':' || xpath[at] !== '(' || colon !== 1) func = ''
  }
  return func
}

/**
 * Whether a nametest opens at given offset.
 * @param {string} xpath - Xpath expression
 * @param {number} at - Offset to test
 * @return {string} - Nametest
 */
const opensNameTest = function(xpath, at) {
  let name=''
  if (at<xpath.length && xpath.slice(at, at + 2) === 'Q{') {
    name += xpath.slice(at, at + 2)
    at += 2
    while (at < xpath.length && xpath[at] !== '{' && xpath[at] !== '}') {
      name = name + xpath[at]
      at++
    }
    if (xpath[at]==='{') {
      name=''
    } else {
      name += xpath[at]
      at++
      const ncname = collectNCName(xpath, at)
      if (ncname !== '') {
        name += ncname
        at += ncname.length
      } else if (at < xpath.length && xpath[at] === '*') {
        name += xpath[at]
        at++
      } else {
        name=''
      }
    }
  } else if (at < xpath.length && xpath[at].match(/[a-zA-Z_]/)) {
    const ncname = collectNCName(xpath, at)
    name+= ncname
    at+=ncname.length
    if (xpath[at] === ':') {
      name += xpath[at]
      at++
      const ncname = collectNCName(xpath, at)
      if (ncname!=='') {
        name += ncname
        at += ncname.length
      } else if (at < xpath.length && xpath[at]==='*') {
        name += xpath[at]
        at++
      }
    }
  } else if (at < xpath.length && xpath[at]==='*') {
    name += xpath[at]
    at++
    if (xpath[at]===':') {
      name += xpath[at]
      at++
      const ncname = collectNCName(xpath, at)
      name+= ncname
      at+=ncname.length
    }
  }
  return name
}

/**
 * Whether a part of nametest (NCName) opens at given offset.
 * @param {string} xpath - Xpath expression
 * @param {number} at - Offset to test
 * @return {string} - NCName
 */
const collectNCName = function(xpath, at) {
  let ncname=''
  if (at < xpath.length && xpath[at].match(/[a-zA-Z_]/)) {
    ncname += xpath[at]
    at++
    while (at < xpath.length && xpath[at].match(/[a-zA-Z0-9_.-]/)) {
      ncname = ncname + xpath[at]
      at++
    }
  }
  return ncname
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
 * Offset just past the number literal opening at given offset.
 * @param {string} xpath - Xpath expression
 * @param {number} start - Offset of the first character of the number literal
 * @return {number} - Offset just past the closing digit
 */
const afterNumber = function(xpath, start) {
  let at = start +1
  let point = 0
  let e = 0
  while (at < xpath.length) {
    if (xpath[at] === '.' && point === 0 && e === 0 ) {
      point += 1
      at += 1
    } else if (DIGIT.includes(xpath[at])) {
      at += 1
    } else if ((xpath[at] === 'e' || xpath[at] === 'E') && e === 0) {
      e+=1
      if (DIGIT.includes(xpath[at+1])) {
        at += 2
      } else if (xpath[at+1] ==='+' || xpath[at+1] === '-') {
        if (DIGIT.includes(xpath[at+2])) {
          at += 3
        } else {
          break
        }
      } else {
        break
      }
    } else {
      break
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
 * @param {number} tokens - Array of found tokens.
 * @return {number} - Offset just past the run
 */
const afterOther = function(xpath, start, tokens) {
  let at = start
  while (
    at < xpath.length &&
    !QUOTES.includes(xpath[at]) &&
    !WHITESPACE.includes(xpath[at]) &&
    !BRACKETS[xpath[at]] &&
    !(SINGLE[xpath[at]] && isOperator(tokens))&&
    !(DOUBLE[xpath.slice(at, at+2)] && isOperator(tokens)) &&
    !(TRIPLE[xpath.slice(at, at+3)] && isOperator(tokens)) &&
    !opensMore(xpath, at) &&
    !opensComment(xpath, at) &&
    !opensUserFunction(xpath, at) &&
    !opensNumber(xpath, at) &&
    !opensAxis(xpath, at) &&
    !opensNameTest(xpath, at)
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
 * Offset just past the whitespace run at given offset.
 * @param {Array.<{type: string, value: string, start: number}>} tokens -
 * Array of found tokens.
 * @return {number} - The found token is operator?
 */
const isOperator = function(tokens) {
  if (tokens.length >=1 &&
    (tokens.at(-1).type===TOKENS.NUMBER ||
      tokens.at(-1).type===TOKENS.NAME_TEST ||
      tokens.at(-1).type===TOKENS.RPAREN)
  ) {
    return true
  } else if (tokens.length >=2 &&
    (tokens.at(-1).type===TOKENS.WHITESPACE &&
      (tokens.at(-2).type===TOKENS.NUMBER ||
        tokens.at(-2).type===TOKENS.NAME_TEST ||
        tokens.at(-2).type===TOKENS.RPAREN)
    )
  ) {
    return true
  }
  return false
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
    } else if (opensAxis(xpath, at)) {
      type = AXES[opensAxis(xpath, at)]
      at += opensAxis(xpath, at).length
    } else if (opensNumber(xpath, at)) {
      type = TOKENS.NUMBER
      at = afterNumber(xpath, at)
    } else if (opensMore(xpath, at) && isOperator(tokens)) {
      type = MORE[opensMore(xpath, at)]
      at+=opensMore(xpath, at).length
    } else if (TRIPLE[xpath.slice(at, at+3)] && isOperator(tokens)) {
      type = TRIPLE[xpath.slice(at, at+3)]
      at+=3
    } else if (DOUBLE[xpath.slice(at, at+2)] && isOperator(tokens)) {
      type = DOUBLE[xpath.slice(at, at+2)]
      at+=2
    } else if (BRACKETS[xpath[at]]) {
      type = BRACKETS[xpath[at]]
      at++
    } else if (SINGLE[xpath[at]] && isOperator(tokens)) {
      type = SINGLE[xpath[at]]
      at++
    } else if (opensUserFunction(xpath, at)) {
      type = TOKENS.USER_FUNCTION
      at+=opensUserFunction(xpath, at).length
    } else if (opensNameTest(xpath, at)) {
      type = TOKENS.NAME_TEST
      at+=opensNameTest(xpath, at).length
    } else {
      type = TOKENS.OTHER
      at = afterOther(xpath, at, tokens)
    }
    tokens.push({type: type, value: xpath.slice(start, at), start: start})
  }
  return tokens
}

module.exports = {
  tokenized,
  TOKENS,
}
