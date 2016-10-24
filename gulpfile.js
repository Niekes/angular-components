'use strict';

var gulp            = require('gulp');
var sass            = require('gulp-sass');
var autoprefixer    = require('gulp-autoprefixer');
var livereload      = require('gulp-livereload');


//-------------------------------------------------
// SASS
//-------------------------------------------------
gulp.task('sass', function(){
    return gulp.src('scss/*.scss')
    .pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer())
    .pipe(gulp.dest('css/'))
    .pipe(livereload());
});

//-------------------------------------------------
// JAVASCRIPT
//-------------------------------------------------
var jsSrc = ['js/**/*.js'];
gulp.task('scripts', function(){
    gulp.src(jsSrc)
    .pipe(livereload());
});

//-------------------------------------------------
// HTML
//-------------------------------------------------
var htmlSrc = ['index.html', 'partials/**/*.html', 'templates/**/*.html'];
gulp.task('html', function(){
    gulp.src(htmlSrc)
    .pipe(livereload());
});

//-------------------------------------------------
// WATCH
//-------------------------------------------------
var scssSrc = ['scss/**/*.scss'];
gulp.task('watch', function(){
    livereload.listen();
    gulp.watch(scssSrc, ['sass']);
    gulp.watch(htmlSrc, ['html']);
    gulp.watch(jsSrc, ['scripts']);
});

//-------------------------------------------------
// DEFAULT
//-------------------------------------------------
gulp.task('default', ['sass', 'html', 'scripts', 'watch']);
