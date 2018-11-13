const server = require('browser-sync');
const gulp = require('gulp');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const insert = require('gulp-insert');
const plumber = require('gulp-plumber');
const fs = require('fs');
const config = require('./config.json');

const src = './assets';
const dist = './public';

// Compile less
gulp.task('less', function() {
	gulp.src([`${src}/less/app.less`])
		.pipe(plumber())
		.pipe(less())
		.pipe(gulp.dest(`${dist}/css`))
		.pipe(server.stream());
});

gulp.task('js', function() {
	gulp.src([`${src}/js/main.js`])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(`${dist}/js`))
		.pipe(server.stream());
});

gulp.task('bookmarklets', function() {
	gulp.src([`${src}/bookmarklets/*`])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(insert.prepend('javascript:(function(){'))
		.pipe(insert.append('})();'))
		.pipe(gulp.dest(`${dist}/bookmarklets`));
});

// Watch for changes
gulp.task('watch', function() {
	gulp.watch(`${src}/js/**/*.js`, ['js']);
	gulp.watch(`${src}/less/**/*.less`, ['less']);
	gulp.watch(`${src}/bookmarklets/*.js`, ['bookmarklets']);
});

// Setup local server with injection
gulp.task('serve', function() {
	server.init({
		proxy: 'localhost:' + config.port,
		notify: false
	});
});

gulp.task('default', ['less', 'bookmarklets']);
gulp.task('dev', ['default', 'watch', 'serve']);
