var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('rimraf');

var paths = {
  scripts: [ 'bower_components/js-scrypt/browser/scrypt.js', 'src/uniquePasswordBuilder.js' ]
};

gulp.task('clean', function(cb){
  rimraf('dist/', cb);
});

gulp.task('scripts', ['clean'], function() {
  return gulp.src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('upb.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
});

gulp.task('default', ['clean', 'scripts']);
