'use strict';

var gulp            = require('gulp');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var browserSync     = require('browser-sync').create();

var jsSrc           = ['js/**/*.js'];
var sassSrc         = ['scss/**/*.scss'];
var htmlSrc         = ['index.html', 'partials/**/*.html', 'templates/**/*.html'];
//-------------------------------------------------
// SASS
//-------------------------------------------------
gulp.task('sass', function(){
    return gulp.src('scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('css/'))
        .pipe(browserSync.stream());
});

//-------------------------------------------------
// JAVASCRIPT
//-------------------------------------------------
gulp.task('js', function(){
    return gulp.src(jsSrc)
        .pipe(browserSync.stream());
});

//-------------------------------------------------
// HTML
//-------------------------------------------------
gulp.task('html', function(){
    return gulp.src(htmlSrc)
        .pipe(browserSync.stream());
});

//-------------------------------------------------
// DEFAULT
//-------------------------------------------------
// use default task to launch BS and watch files
gulp.task('default', ['js', 'html', 'sass'], function () {

    // Serve files from the root of this project
    browserSync.init({
        proxy: 'd3-portfolio.dev'
    });

    gulp.watch(htmlSrc, ['html-watch']);
    gulp.watch(jsSrc,   ['js-watch']);
    gulp.watch(sassSrc, ['sass-watch']);
});
//-------------------------------------------------
// WATCH TASKS
//-------------------------------------------------
gulp.task('html-watch', ['html'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('sass-watch', ['sass'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});
