var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('rimraf');

var paths = {
    index: [
        'bower_components/js-scrypt/browser/scrypt.js',
        'src/passwordgeneration.js'
    ],
    bookmarklet: [
        'bower_components/js-scrypt/browser/scrypt.js',
        'src/passwordgeneration.js',
        'src/ui.js',
        'src/bookmarklet.js'
    ]
};

gulp.task('clean', function(cb){
  rimraf('dist/', cb);
});

gulp.task('bookmarklet', function() {
  return gulp.src(paths.bookmarklet)
    .pipe(uglify())
    .pipe(concat('upb.min.js'))
    .pipe(gulp.dest('dist'));
});
gulp.task('index', function() {
  return gulp.src(paths.index)
    .pipe(uglify())
    .pipe(concat('index.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'index', 'bookmarklet']);
