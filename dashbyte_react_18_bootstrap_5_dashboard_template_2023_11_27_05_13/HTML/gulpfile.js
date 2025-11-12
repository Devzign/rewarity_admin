'use strict';

const { src, dest, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const bs = require('browser-sync').create();
const npmDist = require('gulp-npm-dist');
const htmlInjector = require('bs-html-injector');

// Compile scss files to style.css file
function compileStyle() {
  return src('./scss/style.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(dest('./dist/assets/css'))
  .pipe(bs.stream());
}

// Compile and minify scss files to style.min.css file
function minifyStyle () {
  return src('./scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(dest('./dist/assets/css'))
    .pipe(bs.stream());
}

// Start a server
function serve () {
  bs.use(htmlInjector, {
    files: 'dist/**/*.html'
  });

  // Now init the Browsersync server
  bs.init({
    injectChanges: true,
    server: true,
    notify: false
  });

  // Listen to change events on HTML and reload
  watch('dist/**/*.html').on('change', bs.reload);

  // css files
  watch('scss/*.scss', series(compileStyle, minifyStyle));
  watch('scss/**/*.scss', series(compileStyle, minifyStyle));
}

exports.compileStyle = compileStyle;
exports.minifyStyle = minifyStyle;

exports.serve = serve;
