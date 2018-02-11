var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('rimraf');

var paths = {
    index: [
        'node_modules/scrypt-async/scrypt-async.js',
        'src/passwordgeneration.js',
        'node_modules/argon2-browser/lib/argon2.js'
    ],
    bookmarklet: [
        'node_modules/scrypt-async/scrypt-async.js',
        'src/passwordgeneration.js',
        'node_modules/argon2-browser/lib/argon2.js',
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

gulp.task('argon2', function() {
    return gulp.src('node_modules/argon2-browser/dist/argon2-asm.min.js')
      .pipe(gulp.dest('dist'))
      .pipe(gulp.dest('addon'))
      ;
    });

    gulp.task('font-awesome', ['font-awesome-css', 'font-awesome-fonts']);

    gulp.task('font-awesome-css', function() {
        return gulp.src('node_modules/font-awesome/css/*')
            .pipe(gulp.dest('dist/font-awesome/css'))
            .pipe(gulp.dest('addon/font-awesome/css'));
        });

    gulp.task('font-awesome-fonts', function() {
        return gulp.src('node_modules/font-awesome/fonts/*')
            .pipe(gulp.dest('dist/font-awesome/fonts'))
            .pipe(gulp.dest('addon/font-awesome/fonts'))
            ;
        });

gulp.task('html', function() {
    return gulp.src(['index.html', 'bookmark_scrypt_test.html', 'bookmark_argon2_test.html'])
    .pipe(gulp.dest('dist'))
    ;
    });

gulp.task('assets', function() {
    return gulp.src('assets/*')
    .pipe(gulp.dest('dist'))
    ;
});

gulp.task('addon-copy-js', ['index'], function() {
    gulp.src(paths.index)
    .pipe(gulp.dest('./addon'));
});

gulp.task('addon', ['addon-copy-js']);

gulp.task('page', ['html', 'index', 'assets']);

gulp.task('default', ['page', 'bookmarklet', 'addon', 'argon2', 'font-awesome']);
