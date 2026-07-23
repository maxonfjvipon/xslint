/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const {runXslint, xslintStatus, xslintStreams} = require('./helpers')
const assert = require('assert')
const version = require('../src/version')
const path = require('path')
const fs = require('fs')
const os = require('os')

describe('xslint', function() {
  it('should print its own version', function() {
    const stdout = runXslint(['--version'])
    assert.equal(version.what + '\n', stdout)
  })
  it('should print help screen', function() {
    const stdout = runXslint(['--help'])
    assert.ok(stdout.includes('Usage: xslint'))
    assert.ok(stdout.includes(version.what))
    assert.ok(stdout.includes(version.when))
  })
  it('should set log level', function() {
    const stdout = runXslint(['src', '--log-level=debug'])
    assert.ok(stdout.includes('Log level set to \'debug\''))
  })
  it('should print some violations in xsl file', function() {
    const stdout = runXslint(['test/resources/stylesheets/xsl-with-some-violations.xsl'])
    const expected = [
      'Processed files: 1',
      'Defects found: 7',
      '(26:9) An instruction element such as xsl:for-each, xsl:if, or xsl:when has no content. Add content or remove the empty element. (empty-content-in-instructions)',
      '(27:9) An instruction element such as xsl:for-each, xsl:if, or xsl:when has no content. Add content or remove the empty element. (empty-content-in-instructions)',
      '(6:1) No built-in Schema types are used in XSLT 2.0 or 3.0 mode. Declare variable types with xs:string, xs:integer, or similar. (not-using-schema-types)',
      '(16:3) A variable is assigned via a nested xsl:value-of instead of the select attribute. Use select syntax instead. (setting-value-of-variable-incorrectly)',
      '(16:3) A variable, function, or template has a single-character name. Use a descriptive name that reveals intent. (short-names)',
      '(31:3) The match attribute of xsl:template starts with //, which scans the entire document tree. Use a more specific pattern. (starts-with-double-slash)',
      '(45:3) A named template is never invoked via xsl:call-template. Remove it or call it. (unused-named-template)',
    ]
    expected.forEach((str) => assert.ok(stdout.includes(str)))
  })
  it('should print less violations in xsl file', function() {
    const stdout = runXslint([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      '--suppress=empty-content-in-instructions',
      '--suppress=starts-with-double-slash',
    ]);
    ['Processed files: 1', 'Defects found: 4'].forEach((expected) => assert.ok(stdout.includes(expected)))
    const absented = [
      'empty-content-in-instructions',
      'starts-with-double-slash',
    ]
    absented.forEach((str) => assert.ok(!stdout.includes(str)))
  })
  it('should print no violations in xsl file', function() {
    const stdout = runXslint(['test/resources/stylesheets/xsl-with-no-violations.xsl']);
    ['Processed files: 1', 'No defects found'].forEach((expected) => assert.ok(stdout.includes(expected)))
  })
  it('should test all files', function() {
    const stdout = runXslint([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      'test/resources/stylesheets/xsl-with-no-violations.xsl',
    ])
    const expected = [
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      'test/resources/stylesheets/xsl-with-no-violations.xsl',
    ]
    expected.forEach((str) => assert.ok(stdout.includes(str.split(path.sep).join('/'))))
    assert.ok(stdout.includes('Processed files: 2'))
  })
  it('should test all directories', function() {
    const stdout = runXslint([
      'test/resources/stylesheets',
      'test/resources/templates',
    ])
    const expected = [
      'test/resources/stylesheets',
      'test/resources/templates',
    ]
    expected.forEach((str) => assert.ok(stdout.includes(`${path.resolve(process.cwd(), str)}`)))
    assert.ok(stdout.includes('Processed files: 4'))
  })
  it('should test all files and directories', function() {
    const stdout = runXslint([
      'test/resources/stylesheets',
      'test/resources/templates/xsl-with-no-violations.xsl',
      'test/resources/reports',
      'test/resources/templates/xsl-with-some-violations.xsl',
    ])
    const expected = [
      'test/resources/stylesheets',
      'test/resources/templates/xsl-with-some-violations.xsl',
      'test/resources/reports',
      'test/resources/templates/xsl-with-no-violations.xsl',
    ]
    expected.forEach((str) => assert.ok(stdout.includes(`${str.replace(/\\/g, '/')}`)))
    assert.ok(stdout.includes('Processed files: 6'))
  })
  it('should test default directory', function() {
    const stdout = runXslint([])
    assert.ok(stdout.includes('Directories and files to process: .'))
    assert.ok(stdout.includes('Processed files: 6'))
  })
  it('should test empty suppress', function() {
    const stdout = runXslint([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      '--suppress=',
    ])
    const expected = [
      'Processed files: 1',
      'Defects found: 7',
      '(26:9) An instruction element such as xsl:for-each, xsl:if, or xsl:when has no content. Add content or remove the empty element. (empty-content-in-instructions)',
      '(27:9) An instruction element such as xsl:for-each, xsl:if, or xsl:when has no content. Add content or remove the empty element. (empty-content-in-instructions)',
      '(6:1) No built-in Schema types are used in XSLT 2.0 or 3.0 mode. Declare variable types with xs:string, xs:integer, or similar. (not-using-schema-types)',
      '(16:3) A variable is assigned via a nested xsl:value-of instead of the select attribute. Use select syntax instead. (setting-value-of-variable-incorrectly)',
      '(16:3) A variable, function, or template has a single-character name. Use a descriptive name that reveals intent. (short-names)',
      '(31:3) The match attribute of xsl:template starts with //, which scans the entire document tree. Use a more specific pattern. (starts-with-double-slash)',
      '(45:3) A named template is never invoked via xsl:call-template. Remove it or call it. (unused-named-template)',
    ]
    assert.ok(stdout.includes('Empty suppress is incorrect. Delete this "--suppress" or use another one.'))
    expected.forEach((str) => assert.ok(stdout.includes(str)))
  })
  it('should test incorrect suppress', function() {
    const suppress='qwerty'
    const stdout = runXslint([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      `--suppress=${suppress}`,
    ])
    assert.ok(stdout.includes(`Check with substring '${suppress}' does not exist. Delete this '--suppress' or use another one.`))
  })
  it('should test non-existing directory', function() {
    const dir = 'non-existing-directory'
    const stdout = runXslint([dir])
    assert.ok(stdout.includes(`File or directory ${path.resolve(process.cwd(), dir)} does not exist`))
  })
  it('should test non-existing file', function() {
    const file = 'non-existing-file.xsl'
    const stdout = runXslint([file])
    assert.ok(stdout.includes(`File or directory ${path.resolve(process.cwd(), file)} does not exist`))
  })
  it('should test non-existing file and directory', function() {
    const file = 'non-existing-file.xsl'
    const dir = 'non-existing-directory'
    const stdout = runXslint([file, dir])
    assert.ok(stdout.includes(`File or directory ${path.resolve(process.cwd(), file)} does not exist`))
    assert.ok(stdout.includes(`File or directory ${path.resolve(process.cwd(), dir)} does not exist`))
  })
  it('should lint the parseable stylesheets and report the malformed ones', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    fs.writeFileSync(
      path.join(dir, 'good.xsl'),
      [
        '<?xml version="1.0"?>',
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">',
        '  <xsl:template match="/">',
        '    <xsl:value-of select="1 +"/>',
        '  </xsl:template>',
        '</xsl:stylesheet>',
      ].join('\n'),
    )
    fs.writeFileSync(
      path.join(dir, 'bad.xsl'),
      [
        '<?xml version="1.0"?>',
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">',
        '  <xsl:template match="/">',
        '    <result>',
        '  </xsl:template>',
        '</xsl:stylesheet>',
      ].join('\n'),
    )
    const stdout = runXslint([dir])
    fs.rmSync(dir, {recursive: true, force: true});
    [
      'Processed files: 2',
      'bad.xsl(1:1)',
      'malformed-stylesheet',
      'good.xsl',
      'invalid-xpath-expression',
    ].forEach((str) => assert.ok(stdout.includes(str)))
  })
  it('should exit zero when only warnings are found', function() {
    const status = xslintStatus([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
    ])
    assert.equal(status, 0)
  })
  it('should exit one when warnings exceed the budget', function() {
    const status = xslintStatus([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      '--max-warnings=0',
    ])
    assert.equal(status, 1)
  })
  it('should exit zero when warnings stay within the budget', function() {
    const status = xslintStatus([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      '--max-warnings=10',
    ])
    assert.equal(status, 0)
  })
  it('should exit one when an error is found', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    fs.writeFileSync(
      path.join(dir, 'broken.xsl'),
      [
        '<?xml version="1.0"?>',
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="2.0">',
        '  <xsl:template match="/">',
        '    <result>',
        '  </xsl:template>',
        '</xsl:stylesheet>',
      ].join('\n'),
    )
    const status = xslintStatus([dir, '--max-warnings=100'])
    fs.rmSync(dir, {recursive: true, force: true})
    assert.equal(status, 1)
  })
  it('should print defects to stdout', function() {
    const streams = xslintStreams([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
    ])
    assert.ok(streams.stdout.includes('short-names'))
  })
  it('should print progress logs to stderr', function() {
    const streams = xslintStreams([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
    ])
    assert.ok(streams.stderr.includes('Processed files: 1'))
  })
  it('should keep progress logs out of stdout', function() {
    const streams = xslintStreams([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
    ])
    assert.ok(!streams.stdout.includes('Processed files'))
  })
  it('should suppress informational logs when quiet', function() {
    const streams = xslintStreams([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      '--quiet',
    ])
    assert.ok(!streams.stderr.includes('Processed files'))
  })
  it('should disable a rule named off in the config file', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    const cfg = path.join(dir, '.xslint.yml')
    fs.writeFileSync(cfg, 'rules:\n  short-names: off\n')
    const streams = xslintStreams([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      `--config=${cfg}`,
    ])
    fs.rmSync(dir, {recursive: true, force: true})
    assert.ok(!streams.stdout.includes('short-names'))
  })
  it('should fail when the config promotes a warning to an error', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    const cfg = path.join(dir, '.xslint.yml')
    fs.writeFileSync(cfg, 'rules:\n  short-names: error\n')
    const status = xslintStatus([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      `--config=${cfg}`,
    ])
    fs.rmSync(dir, {recursive: true, force: true})
    assert.equal(status, 1)
  })
  it('should skip files matched by a config exclude glob', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    fs.writeFileSync(path.join(dir, '.xslint.yml'), 'exclude:\n  - "*.xsl"\n')
    fs.writeFileSync(
      path.join(dir, 'sheet.xsl'),
      [
        '<?xml version="1.0"?>',
        '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" ' +
          'version="2.0">',
        '  <xsl:template match="/"><out/></xsl:template>',
        '</xsl:stylesheet>',
      ].join('\n'),
    )
    const streams = xslintStreams([
      dir, `--config=${path.join(dir, '.xslint.yml')}`,
    ])
    fs.rmSync(dir, {recursive: true, force: true})
    assert.ok(streams.stderr.includes('Processed files: 0'))
  })
  it('should apply max-warnings from the config file', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    const cfg = path.join(dir, '.xslint.yml')
    fs.writeFileSync(cfg, 'max-warnings: 0\n')
    const status = xslintStatus([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      `--config=${cfg}`,
    ])
    fs.rmSync(dir, {recursive: true, force: true})
    assert.equal(status, 1)
  })
  it('should let a command-line max-warnings override the config', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    const cfg = path.join(dir, '.xslint.yml')
    fs.writeFileSync(cfg, 'max-warnings: 0\n')
    const status = xslintStatus([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      `--config=${cfg}`,
      '--max-warnings=100',
    ])
    fs.rmSync(dir, {recursive: true, force: true})
    assert.equal(status, 0)
  })
  it('should disable a family of rules by glob in the config', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    const cfg = path.join(dir, '.xslint.yml')
    fs.writeFileSync(cfg, 'rules:\n  "unused-*": off\n')
    const streams = xslintStreams([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      `--config=${cfg}`,
    ])
    fs.rmSync(dir, {recursive: true, force: true})
    assert.ok(!streams.stdout.includes('unused-named-template'))
  })
  it('should warn about an unknown key in the config', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    const cfg = path.join(dir, '.xslint.yml')
    fs.writeFileSync(cfg, 'excludes:\n  - "x"\n')
    const streams = xslintStreams([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      `--config=${cfg}`,
    ])
    fs.rmSync(dir, {recursive: true, force: true})
    assert.ok(streams.stderr.includes('Unknown key \'excludes\''))
  })
  it('should read the log level from the config file', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    const cfg = path.join(dir, '.xslint.yml')
    fs.writeFileSync(cfg, 'log-level: debug\n')
    const streams = xslintStreams([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      `--config=${cfg}`,
    ])
    fs.rmSync(dir, {recursive: true, force: true})
    assert.ok(streams.stderr.includes('Log level set to \'debug\''))
  })
  it('should read quiet from the config file', function() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'xslint-'))
    const cfg = path.join(dir, '.xslint.yml')
    fs.writeFileSync(cfg, 'quiet: true\n')
    const streams = xslintStreams([
      'test/resources/stylesheets/xsl-with-some-violations.xsl',
      `--config=${cfg}`,
    ])
    fs.rmSync(dir, {recursive: true, force: true})
    assert.ok(!streams.stderr.includes('Processed files'))
  })
})
