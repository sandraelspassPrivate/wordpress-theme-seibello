// util for measuring task runtime
const timer = require("grunt-timer");

module.exports = function(grunt) {
    timer.init(grunt);

    // all configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // https://github.com/sindresorhus/grunt-sass
        sass: {
            options: {
            },
            dist: {
                // shows scss comments
                options: {
                    sourceComments: true
                },
                files: {
                    // compiles scss
                    'dist/css/style.css': 'src/scss/style.scss'
                }
            }
        },


        // css linter
        // https://github.com/wikimedia/grunt-stylelint
        // separate task to lint the sources, not the build file
        stylelint: {
            options: {
                configFile: '.stylelintrc',
                formatter: 'string',
                ignoreDisables: false,
                failOnError: true,
                outputFile: '',
                reportNeedlessDisables: false,
                syntax: 'scss'
            },
            src: [
                'src/scss/**/*.scss'
            ]
        },


        // https://github.com/postcss/postcss
        // update the root value if changed in css framework
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({
                        remove: false
                    }),
                    require('cssnano')({
                        preset: [ 'default', {
                            discardComments: {
                                removeAll: true
                            }
                        } ]
                    })
                ]
            },
            dist: {
                src: 'dist/css/style.css',
                dest: 'dist/css/style.min.css'
            }
        },



        // https://github.com/gruntjs/grunt-contrib-concat
        concat: {
            lib: {
                src: [
                    // LIBRARY SCRIPTS

                    // jQuery
                    'src/js/lib/jquery-3.3.1.js',

                    // foundation 6
                    // core MUST BE first one to include!
                    'src/js/lib/foundation/foundation.core.js',

                    // remove unused plugins
                    'src/js/lib/foundation/foundation.abide.js',
                    'src/js/lib/foundation/foundation.accordion.js',
                    'src/js/lib/foundation/foundation.accordionMenu.js',
                    'src/js/lib/foundation/foundation.drilldown.js',
                    'src/js/lib/foundation/foundation.dropdown.js',
                    'src/js/lib/foundation/foundation.dropdownMenu.js',
                    'src/js/lib/foundation/foundation.interchange.js',
                    'src/js/lib/foundation/foundation.equalizer.js',
                    'src/js/lib/foundation/foundation.magellan.js',
                    'src/js/lib/foundation/foundation.offcanvas.js',
                    'src/js/lib/foundation/foundation.orbit.js',
                    'src/js/lib/foundation/foundation.responsiveMenu.js',
                    'src/js/lib/foundation/foundation.responsiveToggle.js',
                    'src/js/lib/foundation/foundation.reveal.js',
                    'src/js/lib/foundation/foundation.slider.js',
                    'src/js/lib/foundation/foundation.sticky.js',
                    'src/js/lib/foundation/foundation.tabs.js',
                    'src/js/lib/foundation/foundation.toggler.js',
                    'src/js/lib/foundation/foundation.tooltip.js',
                    'src/js/lib/foundation/foundation.util.box.js',
                    'src/js/lib/foundation/foundation.util.keyboard.js',
                    'src/js/lib/foundation/foundation.util.mediaQuery.js',
                    'src/js/lib/foundation/foundation.util.motion.js',
                    'src/js/lib/foundation/foundation.util.nest.js',
                    'src/js/lib/foundation/foundation.util.timerAndImageLoader.js',
                    'src/js/lib/foundation/foundation.util.touch.js',
                    'src/js/lib/foundation/foundation.util.triggers.js',

                    // cookiebar
                    'src/js/lib/jquery.cookieBar.js',
                ],
                dest: 'dist/js/lib.es2015.js'
            },
            custom: {
                src: [

                    // CUSTOM SCRIPTS
                    'src/js/custom/**/*.js'
                ],
                dest: 'dist/js/custom.js'
            }
        },


        // http://eslint.org/
        // https://github.com/sindresorhus/grunt-eslint
        eslint: {
            options: {
                quiet: false,
                maxWarnings: -1,
                fix: true
            },
            target: [
                'src/js/custom/**/*.js'
            ]
        },

        // https://github.com/babel/grunt-babel
        // http://babeljs.io/docs/usage/options/
        babel: {
            options: {
                sourceMap: true,
                compact: false,
                presets: [ 'es2015' ]
            },
            dist: {
                files: {
                    'dist/js/lib.js': 'dist/js/lib.es2015.js'
                }
            }
        },

        // https://github.com/gruntjs/grunt-contrib-uglify
        uglify: {
            lib: {
                files: {
                    'dist/js/lib.min.js': 'dist/js/lib.js'
                }
            },
            custom: {
                files: {
                    'dist/js/custom.min.js': 'dist/js/custom.js'
                }
            }
        },


        // https://github.com/gruntjs/grunt-contrib-watch
        watch: {
            // watches itself for changes
            // for grunt dev only
            // grunt: { files: [ 'Gruntfile.js' ] },


            // watches script folder
            scripts: {
                files: [ 'src/js/custom/**/*.js' ],
                tasks: [ 'eslint', 'concat:custom', 'uglify:custom' ],
                options: {
                    spawn: false
                }
            },

            // watches scss folder, trigger compiles w/ libsass
            css: {
                files: [ 'src/scss/**/*.scss', 'src/markup/**/*.html' ],
                tasks: [ 'stylelint', 'sass', 'postcss' ],
                options: {
                    spawn: false
                }
            }
        }
    });

    // loads all tasks found in package.json
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-stylelint');
    grunt.loadNpmTasks('grunt-postcss');

    // where we tell grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [ 'watch' ]);

    // compile js-lib manually when changed!
    grunt.registerTask('js-conf', [ 'concat:conf' ]);
    grunt.registerTask('js-lib', [ 'concat:lib', 'babel', 'uglify:lib' ]);
    grunt.registerTask('js-custom', [ 'eslint', 'concat:custom', 'uglify:custom' ]);
    grunt.registerTask('css', [ 'stylelint', 'sass', 'postcss' ]);
    grunt.registerTask('build', [ 'svg', 'css', 'js-conf', 'js-lib', 'js-custom' ]);

};