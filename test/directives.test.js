/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {directivesFrom, suppresses, unused} = require('../src/directives')
const assert = require('assert')

describe('directives', function() {
  it('reads a disable-next-line directive with its line and names', function() {
    assert.deepStrictEqual(
      directivesFrom('a\nb\n<!-- xslint-disable-next-line short-names -->\n')[0],
      {type: 'disable-next-line', line: 3, names: ['short-names']},
    )
  })
  it('reads a nameless disable-file directive as covering everything', function() {
    assert.deepStrictEqual(
      directivesFrom('<!-- xslint-disable-file -->\n')[0],
      {type: 'disable-file', line: 1, names: []},
    )
  })
  it('suppresses a defect on the line after a disable-next-line', function() {
    assert.ok(
      suppresses(
        [{type: 'disable-next-line', line: 3, names: ['short-names']}],
        {name: 'short-names', line: 4},
      ),
    )
  })
  it('does not suppress a defect the directive does not name', function() {
    assert.ok(
      !suppresses(
        [{type: 'disable-next-line', line: 3, names: ['short-names']}],
        {name: 'unused-variable', line: 4},
      ),
    )
  })
  it('suppresses any defect in the file for a disable-file', function() {
    assert.ok(
      suppresses(
        [{type: 'disable-file', line: 1, names: []}],
        {name: 'anything', line: 99},
      ),
    )
  })
  it('does not suppress a defect on another line', function() {
    assert.ok(
      !suppresses(
        [{type: 'disable-line', line: 5, names: []}],
        {name: 'short-names', line: 6},
      ),
    )
  })
  it('reports a directive that covers no defect as unused', function() {
    assert.deepStrictEqual(
      unused(
        [{type: 'disable-next-line', line: 3, names: ['short-names']}],
        [{name: 'short-names', line: 9}],
      ),
      [{type: 'disable-next-line', line: 3, names: ['short-names']}],
    )
  })
  it('does not report a directive that covers a defect as unused', function() {
    assert.deepStrictEqual(
      unused(
        [{type: 'disable-next-line', line: 3, names: ['short-names']}],
        [{name: 'short-names', line: 4}],
      ),
      [],
    )
  })
})
