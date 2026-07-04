/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {validate} = require('../src/xsl-validator')
const assert = require('assert')

describe('xsl-validator', function() {
  it('should keep a well-formed stylesheet in the corpus', function() {
    const {corpus} = validate([
      {file: 'good.xsl', content: '<a><b/></a>'},
    ])
    assert.equal(corpus[0].file, 'good.xsl')
  })
  it('should report a malformed stylesheet as a defect', function() {
    const {defects} = validate([
      {file: 'broken.xsl', content: '<a><b></a>'},
    ])
    assert.equal(defects[0].name, 'malformed-stylesheet')
  })
  it('should leave a malformed stylesheet out of the corpus', function() {
    const {corpus} = validate([
      {file: 'broken.xsl', content: '<a><b></a>'},
    ])
    assert.equal(corpus.length, 0)
  })
  it('should keep only the parseable stylesheets when sources are mixed',
    function() {
      const {corpus} = validate([
        {file: 'good.xsl', content: '<a><b/></a>'},
        {file: 'broken.xsl', content: '<a><b></a>'},
      ])
      assert.equal(corpus[0].file, 'good.xsl')
    })
  it('should report one defect per malformed stylesheet when mixed',
    function() {
      const {defects} = validate([
        {file: 'good.xsl', content: '<a><b/></a>'},
        {file: 'broken.xsl', content: '<a><b></a>'},
      ])
      assert.equal(defects.length, 1)
    })
  it('should not report a malformed stylesheet when its check is suppressed',
    function() {
      const {defects} = validate(
        [{file: 'broken.xsl', content: '<a><b></a>'}],
        ['malformed-stylesheet'],
      )
      assert.equal(defects.length, 0)
    })
})
