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
