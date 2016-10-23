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
    .pipe(gulp.dest('angular-components/css/'))
    .pipe(livereload());
});

//-------------------------------------------------
// JAVASCRIPT
//-------------------------------------------------
var jsSrc = ['angular-components/js/**/*.js'];
gulp.task('scripts', function(){
    gulp.src(jsSrc)
    .pipe(livereload());
});

//-------------------------------------------------
// HTML
//-------------------------------------------------
var htmlSrc = ['angular-components/index.html', 'angular-components/partials/**/*.html'];
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
