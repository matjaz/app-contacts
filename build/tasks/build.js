var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var traceur = require('gulp-traceur');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var assign = Object.assign || require('object.assign');
var rename_ = require('gulp-rename');

var TRACEUR_OPTIONS = {
  modules: 'instantiate',
  script: false,
  types: true,
  // typeAssertions: true,
  // typeAssertionModule: 'assert',
  annotations: true,
  sourceMaps: 'file'
};

// A wrapper around gulp-rename to support `dirnamePrefix`.
function rename(obj) {
  return rename_(function(parsedPath) {
    return {
      extname: obj.extname || parsedPath.extname,
      dirname: (obj.dirnamePrefix || '') + parsedPath.dirname,
      basename: parsedPath.basename
    };
  });
}

gulp.task('build-system', function () {
  return gulp.src(paths.source, {base: paths.root})
    .pipe(plumber())
    // Rename before Traceur, so that Traceur has the knowledge of both input and output paths.
    .pipe(rename({extname: '.js', dirnamePrefix: paths.output}))
    .pipe(sourcemaps.init())
    .pipe(traceur(TRACEUR_OPTIONS))
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/' + paths.root }))
    .pipe(gulp.dest('.'));
});

gulp.task('build-html', function () {
  return gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-html'],
    callback
  );
});
