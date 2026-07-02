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
  it('checks the value of integer', function() {
    assert.equal(
      tokenized('w 123 q').find((token) => token.type === TOKENS.NUMBER).value,
      '123',
    )
  })
  it('checks the value of decimal', function() {
    assert.equal(
      tokenized('w 123.1 q').find((token) => token.type === TOKENS.NUMBER).value,
      '123.1',
    )
  })
  it('checks the value of decimal without the digits at the beginning', function() {
    assert.equal(
      tokenized('w .1 q').find((token) => token.type === TOKENS.NUMBER).value,
      '.1',
    )
  })
  it('checks the value of decimal without the digits at the end', function() {
    assert.equal(
      tokenized('w 123. q').find((token) => token.type === TOKENS.NUMBER).value,
      '123.',
    )
  })
  it('checks the number with point and "e"', function() {
    assert.equal(
        tokenized('w 1.5e10 q').find((token) => token.type === TOKENS.NUMBER).value,
        '1.5e10',
    )
  })
  it('checks the value of decimal with "-" or "+" point after "e" or "E"', function() {
    assert.equal(
        tokenized('123e-45').find((token) => token.type === TOKENS.NUMBER).value,
        '123e-45',
    )
  })
  it('checks the value of decimal with more than 1 point', function() {
    assert.equal(
      tokenized('123.45.6').find((token) => token.type === TOKENS.NUMBER).value,
      '123.45',
    )
  })
  it('checks the value of decimal with more than 1 "e" or "E"', function() {
    assert.equal(
      tokenized('123e45E6').find((token) => token.type === TOKENS.NUMBER).value,
      '123e45',
    )
  })
  it('checks the value of decimal with point after "e"', function() {
    assert.equal(
      tokenized('123e45.6').find((token) => token.type === TOKENS.NUMBER).value,
      '123e45',
    )
  })
})
