/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {tokenized, TOKENS} = require('../src/tokens')
const assert = require('assert')

describe('tokens', function() {
  it('tokenizes a run of spaces as one whitespace token', function() {
    assert.equal(
      tokenized('a  b').find((token) => token.type === TOKENS.WHITESPACE).value,
      '  ',
    )
  })
  it('records the offset where a token starts', function() {
    assert.equal(
      tokenized('a  b').find((token) => token.type === TOKENS.WHITESPACE).start,
      1,
    )
  })
  it('keeps a string literal whole despite the spaces inside it', function() {
    assert.ok(
      tokenized('"a  b"').every((token) => token.type !== TOKENS.WHITESPACE),
    )
  })
  it('keeps a comment whole despite the spaces inside it', function() {
    assert.ok(
      tokenized('(: a  b :)').every((token) => token.type !== TOKENS.WHITESPACE),
    )
  })
  it('treats doubled quotes inside a literal as an escape', function() {
    assert.equal(tokenized('"a""b"').length, 1)
  })
  it('treats doubled quotes inside a literal as an escape', function() {
    assert.equal(tokenized('"a""b"').length, 1)
  })
  it('finds brackets and parentheses', function() {
    const FULL = [
      '( w e',
      'w ) e',
      'w [ e',
      't t ]',
    ]
    const ACTUAL = [
      TOKENS.LPAREN,
      TOKENS.RPAREN,
      TOKENS.LBRACKET,
      TOKENS.RBRACKET,
    ]
    FULL.forEach((string, index) => {
      assert.ok(
        tokenized(string).filter((token) => token.type === ACTUAL[index])
          .length === 1,
      )
    })
  })
  it('finds operators', function() {
    const FULL = [
      '+ w e',
      'w -e',
      'w 7*',
      't = t',
      '!= w e',
      '2<=7',
      'w 1 or',
      't eq t',
      'and w e',
      '2div7',
      'w mod',
    ]
    const ACTUAL = [
      TOKENS.PLUS,
      TOKENS.MINUS,
      TOKENS.MULTI,
      TOKENS.EQUAL,
      TOKENS.NOT_EQUAL,
      TOKENS.LESS_EQUAL,
      TOKENS.OR,
      TOKENS.EQ,
      TOKENS.AND,
      TOKENS.DIV,
      TOKENS.MOD,
    ]
    FULL.forEach((string, index) => {
      assert.ok(
          tokenized(string).filter((token) => token.type === ACTUAL[index])
              .length === 1,
      )
    })
  })
  it('finds more\'s operators', function() {
    const FULL = [
      'union w e',
      '2except7',
      'w intersect',
      'instance of'
    ]
    const ACTUAL = [
      TOKENS.UNION,
      TOKENS.EXCEPT,
      TOKENS.INTERSECT,
      TOKENS.INSTANCE_OF,
    ]
    FULL.forEach((string, index) => {
      assert.ok(
          tokenized(string).filter((token) => token.type === ACTUAL[index])
              .length === 1,
      )
    })
  })
})
