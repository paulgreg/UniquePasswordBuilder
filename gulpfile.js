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


gulp.task('clean-dist', function(cb){
  rimraf('dist/', cb);
});

gulp.task('clean', ['clean-dist']);

gulp.task('bookmarklet', function() {
  return gulp.src(paths.bookmarklet)
    .pipe(uglify())
    .pipe(concat('upb.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('index', function() {
  return gulp.src(paths.index)
    .pipe(uglify())
    .pipe(concat('upb-main.min.js'))
    .pipe(gulp.dest('dist'));
});


gulp.task('addon-copy-icon', function() {
    gulp.src('./icon.png')
    .pipe(gulp.dest('./firefox-addon/data'));
});

gulp.task('addon-copy-js', ['index'], function() {
    gulp.src('./dist/upb-main.min.js')
    .pipe(gulp.dest('./firefox-addon/data'));
});

gulp.task('addon', ['addon-copy-icon', 'addon-copy-js']);

gulp.task('default', ['clean', 'index', 'bookmarklet', 'addon']);
