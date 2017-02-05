var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var path = require('path');
var fs = require('fs');
var pkg = require('./package.json');


gulp.task('less', function () {
	fs.stat('./src/css/app.less', function(err, stat) {
		if(err != null) {
			console.log('Error:' + err.code);
		}
	});
	gulp.src('./src/css/app.less')
	.pipe(less({
		paths: [ path.join(__dirname, 'less', 'includes') ]
	}))
	.pipe(gulp.dest('./src/css/'));

	gulp.src('./src/css/main.less')
	.pipe(less({
		paths: [ path.join(__dirname, 'less', 'includes') ]
	}))
	.pipe(gulp.dest('./src/css/'))
	.pipe(browserSync.reload({
		stream: true
	}));
});

// Minify compiled CSS
gulp.task('minify-css', ['less'], function() {
    return gulp.src('./src/css/main.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('./src/js/main.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./src/js'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('./src/css/font-awesome'))
});

gulp.task('default', ['less', 'minify-css', 'minify-js', 'copy']);