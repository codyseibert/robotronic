var gulp = require('gulp');
var browserify = require('gulp-browserify');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
  return gulp.src('./app/src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('copy', function() {
  gulp.src('./app/index.html')
    .pipe(gulp.dest('build'));

  gulp.src('./app/assets/**/*')
    .pipe(gulp.dest('build/assets'));
});

gulp.task('scripts', function() {
	gulp.src('./app/src/app.js')
		.pipe(browserify({
		  insertGlobals : true,
		  debug : !gulp.env.production
		}))
    .on('error', function(err) {
      console.log(err);
    })
		.pipe(gulp.dest('build'))
});

gulp.task('connect', function() {
  connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('reload', function () {
  // TODO: Figure out why this timeout is needed
  setTimeout(function() {
    gulp.src('./build/index.html')
      .pipe(connect.reload());
  }, 1000);
});

gulp.task('watch', function () {
  gulp.watch(['./app/index.html', './app/src/**/*.js', './app/assets/**/*'], ['build', 'reload']);
});

gulp.task('build', ['lint', 'copy', 'scripts'])

gulp.task('default', ['build', 'connect', 'watch']);
