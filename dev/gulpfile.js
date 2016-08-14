var gulp = require('gulp'),
    to5  = require('gulp-babel'),
    del  = require('del'),
    rename = require('gulp-rename'),
    mocha  = require('gulp-mocha'),
    browserify = require('gulp-browserify2');

// Build the Plugin

gulp.task( 'clean', function(cb) {
  del([
    'build/*',
    'test/*.js'
  ], cb);
});

gulp.task( 'build-es6', ['clean'], function() {
  return gulp.src('src/**/*.es6')
             .pipe( to5() )
             .pipe( rename( function(path) {
               path.extname = '.js';
             }) )
             .pipe( gulp.dest('build') );
});

gulp.task( 'build-app', ['build-es6'], function() {
  return gulp.src('build/MainComp.js')
             .pipe( browserify({
               fileName: 'app.js',
               options: { debug: false }
             }) )
             .pipe( gulp.dest('build') );
});

// Test the Plugin

gulp.task( 'clean-tests', function(cb) {
  del( [ 'test/*.js' ], cb );
});

gulp.task( 'build-tests', ['clean-tests'], function() {
  return gulp.src('test/**/*.es6')
             .pipe( to5() )
             .pipe( rename( function(path) {
               path.extname = '.js';
             }) )
             .pipe( gulp.dest('test') );
});

gulp.task( 'test', ['build-tests', 'build-es6'], function() {
  return gulp.src(['test/test-*.js'], {read: false})
             .pipe( mocha({ reporter: 'spec' }) );
});

