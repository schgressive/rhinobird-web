// Generated on 2013-06-28 using generator-angular 0.3.0
'use strict';

var LIVERELOAD_PORT = 35729;
var COMMENTS_APP_HOST = process.env.COMMENTS_APP_HOST || 'localhost';
var COMMENTS_APP_PORT = process.env.COMMENTS_APP_PORT || 8000;
var COMMENTS_APP_PROTOCOL = process.env.COMMENTS_APP_PROTOCOL || 'http';

var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });

var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};
var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var modRewrite = require('connect-modrewrite');

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadNpmTasks('grunt-connect-proxy');

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      coffee: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
      },
      livereload: {
        options: {
          nospawn: false,
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.app %>/video/{,*/}*.{mp4,webm,ogv}'
        ]
      }
    },
    connect: {
      options: {
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        protocol: grunt.option('ssl')? 'https' : 'http',
        port: grunt.option('ssl')? 8443 : 9000
      },
      proxies: [
        {
          context: '/comments_app_host',
          ws: true,
          host: COMMENTS_APP_HOST,
          port: COMMENTS_APP_PORT,
          https: (COMMENTS_APP_PROTOCOL == 'https' ? true : false),
          //xforward: true,
          headers: {
            'host': COMMENTS_APP_PROTOCOL + '://' + COMMENTS_APP_HOST + ':' + COMMENTS_APP_PORT
          },
          rewrite: {
            '^/comments_app_host': ''
          }
        },
        {
          context: '/v1',
          changeOrigin: true,
          host: process.env.PROXY_HOST || 'localhost',
          port: process.env.PROXY_PORT || 3000,
          https: false
        },
        {
          context: '/registration',
          changeOrigin: true,
          host: process.env.PROXY_HOST || 'localhost',
          port: process.env.PROXY_PORT || 3000,
          https: false
        }
      ],
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              proxySnippet,
              modRewrite([
                '!\\.?(js|css|html|eot|svg|ttf|woff|otf|css|png|jpg|git|ico|webm|mp4|ogv) / [L]'
              ]),
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      dev: {
        options: {
          middleware: function (connect) {
            return [
              proxySnippet,
              modRewrite([
                '!\\.?(js|css|html|eot|svg|ttf|woff|otf|css|png|jpg|git|ico|webm|mp4|ogv) / [L]'
              ]),
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              proxySnippet,
              modRewrite([
                '!\\.?(js|css|html|eot|svg|ttf|woff|otf|css|png|jpg|git|ico|webm|mp4|ogv) / [L]'
              ]),
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: '<%= connect.options.protocol %>://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images/generated',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/images',
        httpGeneratedImagesPath: '/images/generated',
        httpFontsPath: '/fonts',
        relativeAssets: false
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
      dist: {}
    },*/
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/{,*/}/*.*'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%= yeoman.dist %>/*.html', '<%= yeoman.dist %>/views/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        basedir: '<%= yeoman.dist %>',
        dirs: ['<%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/images'
        },
        {
          expand: true,
          cwd: '<%= yeoman.app %>/img',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/img'
        }]
      }
    },
    cssmin: {
      // By default, your `index.html` <!-- Usemin Block --> will take care of
      // minification. This option is pre-configured if you do not wish to use
      // Usemin blocks.
      // dist: {
      //   files: {
      //     '<%= yeoman.dist %>/styles/main.css': [
      //       '.tmp/styles/{,*/}*.css',
      //       '<%= yeoman.app %>/styles/{,*/}*.css'
      //     ]
      //   }
      // }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'views/{,*/}*.html', 'views/templates/{,*/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'images/{,*/}*.{gif,webp,svg}',
            'img/{,*/}*.{gif,webp,svg}',
            'fonts/*',
            'video/*',
            'vendor/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: [
            'generated/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/styles',
          dest: '<%= yeoman.dist %>/styles',
          src: [
            '*'
          ]
        }]
      }
    },
    concurrent: {
      server: [
        'coffee:dist',
        'compass:server'
      ],
      test: [
        'coffee',
        'compass'
      ],
      dist: [
        'coffee',
        'compass:dist',
        'imagemin',
        'htmlmin'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/scripts/scripts.js': [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'open',
        'configureProxies',
        'connect:dist:keepalive'
      ]);
    }

    var defaultServer = [
      'clean:server',
      'concurrent:server',
      'configureProxies',
      'connect:livereload',
      'open',
      'watch'
    ]

    var noLivereloadServer = [
      'clean:server',
      'concurrent:server',
      'open',
      'configureProxies',
      'connect:dev:keepalive'
    ]
    var liveReload = grunt.option('livereload') || grunt.option('livereload') === undefined? true : false;
    grunt.task.run(liveReload ? defaultServer : noLivereloadServer);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    'concat',
    'copy',
    'cdnify',
    'ngmin',
    'cssmin',
    'uglify',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};
