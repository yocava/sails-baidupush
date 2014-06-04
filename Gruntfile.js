module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    mochaTest: {
      options: {
        reporter: 'spec',
        require: ['./test/common.js']
      },
      unit: {
        src: ['test/unit/**/*.js']
      },
      integration: {
        src: ['test/integration/**/*.js']
      },
      functional: {
        src: ['test/functional/**/*.js']
      }
    }

  });

  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task(s).
  grunt.registerTask('default', ['mochaTest']);

  //
  grunt.registerTask('unit', ['mochaTest:unit']);
  grunt.registerTask('functional', ['mochaTest:functional']);
  grunt.registerTask('integration', ['mochaTest:integration']);

};