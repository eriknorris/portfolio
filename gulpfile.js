'use strict';

var gulp          = require('gulp');
var sass          = require('gulp-sass')(require('sass'));
var browserSync   = require('browser-sync').create();
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var rename        = require('gulp-rename');
var rtlcss        = require('gulp-rtlcss');
var gulpif        = require('gulp-if');

var enableRTL     = false; // TODO: RTL CSS will be only generated if this is TRUE

var Paths = {
    TEMPLATE: './',
    SCSS: './assets/scss/**/*.scss',
    CSS: './assets/css/',
    JS: './**/*.js',
    HTML: './**/*.html'
}

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp.src(Paths.SCSS)
      .pipe(sourcemaps.init())
      .pipe(sass.sync({
          outputStyle: 'expanded'
      }).on('error', sass.logError)) 
      .pipe(autoprefixer({
          overrideBrowserslist: ['last 2 versions']
      }))
      .pipe(gulp.dest(Paths.CSS))
      .pipe(gulpif(enableRTL, rtlcss()))
      .pipe(gulpif(enableRTL, rename({ suffix: '-rtl' })))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(Paths.CSS))
      .pipe(browserSync.stream());
});


// Static Server
gulp.task('serve', function(done) {
    browserSync.init({
      server: Paths.TEMPLATE
    });
    done();
});

// Watching files
gulp.task('watch', function(done) {
    gulp.watch(Paths.SCSS).on('change', gulp.series('sass', browserSync.reload));
    gulp.watch(Paths.HTML).on('change', browserSync.reload);
    gulp.watch(Paths.JS).on('change', browserSync.reload);
    done();
});

gulp.task('default', gulp.series('sass', 'serve', 'watch'));