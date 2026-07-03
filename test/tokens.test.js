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
  it('records the offset where a number starts', function() {
    assert.equal(
      tokenized('$a + 12').find((token) => token.type === TOKENS.NUMBER).start,
      5,
    )
  })
  it('checks the correct value of number with whitespaces around', function() {
    const FULL = [
      'w 123 q',
      'w 123.1 q',
      'w .1 q',
      'w 123. q',
      'w 1.5e10 q',
      'w 123e-45 q',
    ]
    const ACTUAL = [
      '123',
      '123.1',
      '.1',
      '123.',
      '1.5e10',
      '123e-45',
    ]
    FULL.forEach((string, index) => {
      assert.equal(
        tokenized(string).find((token) => token.type === TOKENS.NUMBER).value,
        ACTUAL[index],
      )
    })
  })
  it('checks the incorrect value of number with no whitespaces around', function() {
    const FULL = [
      '123.45.6',
      '123e45E6',
      '123e45.6',
    ]
    const ACTUAL = [
      '123.45',
      '123e45',
      '123e45',
    ]
    FULL.forEach((string, index) => {
      assert.equal(
        tokenized(string).find((token) => token.type === TOKENS.NUMBER).value,
        ACTUAL[index],
      )
    })
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
      't eq t',
      '2div7',
      'union w e',
      'instance of',
    ]
    const ACTUAL = [
      TOKENS.PLUS,
      TOKENS.MINUS,
      TOKENS.MULTI,
      TOKENS.EQUAL,
      TOKENS.NOT_EQUAL,
      TOKENS.EQ,
      TOKENS.DIV,
      TOKENS.UNION,
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
