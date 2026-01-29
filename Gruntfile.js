/*
 * SPDX-FileCopyrightText: Copyright (c) 2025-2026 Max Trunnikov
 * SPDX-License-Identifier: MIT
 */

'use strict'

module.exports = function(grunt) {
  grunt.initConfig({
    eslint: {
      target: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js']
    },
    mochacli: {
      test: {
        options: {
          files: ['test/**/*.test.js', '!test/resources/**'],
        }
      }
    }
  })
  grunt.loadNpmTasks('grunt-eslint')
  grunt.loadNpmTasks('grunt-mocha-cli')
  grunt.registerTask('default', ['mochacli', 'eslint'])
}
