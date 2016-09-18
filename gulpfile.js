'use strict'
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');

gulp.task('watch', () => {
  gulp.watch([
    './src/*',
    './test/*']
  , ['lint-src', 'lint-test', 'test']);
});

gulp.task('lint-src', () => {
  return gulp.src('./src/*.js')
    .pipe(eslint(require('./.eslintrc.json')))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('lint-test', () => {
  return gulp.src('./test/*.js')
    .pipe(eslint(require('./.eslintrc.json')))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('test', () => {
    return gulp.src('./test/*.js', {read: true})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['watch']);