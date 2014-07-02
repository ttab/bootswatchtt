module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    builddir: '.',
    banner: '/*!\n' +
            ' * <%= pkg.name %> v<%= pkg.version %>\n' +
            ' * Homepage: <%= pkg.homepage %>\n' +
            ' * Copyright 2012-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' * Licensed under <%= pkg.license %>\n' +
            ' * Based on Bootstrap\n' +
            '*/\n',
    swatch: {
      tt:{}
    },
    clean: {
      build: {
        src: ['*/build.less', '!global/build.less']
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      dist: {
        src: [],
        dest: ''
      }
    },
    less: {
      production: {
        options: {
          cleancss: true,
          compress: false
        },
        files: {}
      }
    }
  });

  grunt.registerTask('none', function() {});

  grunt.registerTask('build', 'build a regular theme', function(theme, compress) {
    var compress    = compress == undefined ? true : compress;

    var concatSrc   = 'global/build.less',
        concatDest  = theme + '/build.less',
        lessDest    = '<%=builddir%>/' + theme + '/bootstrap.css',
        lessSrc     = [ theme + '/' + 'build.less' ],
        files       = {},
        dist        = {};

        dist = {src: concatSrc, dest: concatDest};
        grunt.config('concat.dist', dist);
        files = {}; files[lessDest] = lessSrc;
        grunt.config('less.dist.files', files);
        grunt.config('less.dist.options.compress', false);

    // Addition by TT
    //grunt.file.copy('bower_components/bootstrap/dist/js/bootstrap.js', theme + '/bootstrap.js');


    grunt.task.run(['concat', 'less:dist', 'clean:build',
      compress ? 'compress:'+lessDest+':'+'<%=builddir%>/' + theme + '/bootstrap.min.css':'none']);
  });

  grunt.registerTask('compress', 'compress a generic css', function(fileSrc, fileDst) {
    var files = {}; files[fileDst] = fileSrc;
    grunt.log.writeln('compressing file ' + fileSrc);

    grunt.config('less.dist.files', files);
    grunt.config('less.dist.options.compress', true);
    grunt.task.run(['less:dist']);
  });

  grunt.registerMultiTask('swatch', 'build a theme', function() {
    var t = this.target;
    grunt.task.run('build:'+t);
  });

  grunt.registerTask('default', 'build a theme', function() {
    grunt.task.run('swatch');
  });
};