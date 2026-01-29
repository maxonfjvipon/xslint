/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

const fs = require('fs')
const path = require('path')
const {DOMParser} = require('xmldom')
const yaml = require('yaml')

/**
 * XML Parser
 * @type {DOMParser}
 */
const parser = new DOMParser()

/**
 * Get all the files recursively from given directory
 * @param {String} dir - Directory path
 * @return {Array.<String>} - Array of file in given directory
 */
const allFilesFrom = function(dir) {
  const files = fs.readdirSync(dir, {withFileTypes: true})
  const res = []
  for (const file of files) {
    if (file.isDirectory()) {
      res.push(...allFilesFrom(path.join(dir, file.name)))
    } else {
      res.push(path.resolve(dir, file.name))
    }
  }
  return res
}

/**
 * Read file content and parse it.
 * @param {String} type - Type of document
 * @param {function(str: String): any} fromString - Function that parses from string
 * @return {function(path: String): any} - Function that checks file and parses from string
 */
const fromFile = function(type, fromString) {
  return function(path) {
    if (!fs.existsSync(path)) {
      throw new Error(`${type} file ${path} does not exist, can't parse`)
    }
    if (fs.statSync(path).isDirectory()) {
      throw new Error(`${type} file ${path} is directory, can't parse`)
    }
    return fromString(fs.readFileSync(path, 'utf-8'))
  }
}

/**
 * Parse XML from string.
 * @param {String} str - XML as string
 * @return {Document} - Parsed XML as Document
 */
const xmlFromString = function(str) {
  let parsed
  try {
    parsed = parser.parseFromString(str, 'text/xml')
  } catch (err) {
    throw new Error(`Couldn't parse XML:\n${str}\n\nCause: ${err.message}`)
  }
  return parsed
}

/**
 * Parse YAML from string.
 * @param {String} str - YAML as string
 * @return {any} - Parses YAML
 */
const yamlFromString = function(str) {
  let parsed
  try {
    parsed = yaml.parse(str)
  } catch (err) {
    throw new Error(`Couldn't parse YAML:\n${str}\n\nCause: ${err.message}`)
  }
  return parsed
}

module.exports = {
  allFilesFrom,
  xml: {
    parsedFromFile: fromFile('XML', xmlFromString),
    parsedFromString: xmlFromString
  },
  yaml: {
    parsedFromFile: fromFile('YAML', yamlFromString),
    parsedFromString: yamlFromString
  }
}
