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
})
