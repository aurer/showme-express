const server = require('browser-sync');
const gulp = require('gulp');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const insert = require('gulp-insert');
const plumber = require('gulp-plumber');
const config = require('./config.json');

const src = './assets';
const dist = './public';

// Compile less
function css(cb) {
	gulp.src([`${src}/less/app.less`])
		.pipe(plumber())
		.pipe(less())
		.pipe(gulp.dest(`${dist}/css`))
		.pipe(server.stream());
		cb();
};

// Compile javascrip
function js(cb) {
	gulp.src([`${src}/js/main.js`])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(`${dist}/js`))
		.pipe(server.stream());
		cb();
};

// Copy graphics
function gfx(cb) {
	gulp.src(`${src}/gfx/*`)
		.pipe(gulp.dest(`${dist}/gfx`));
		cb();
};

// Compile bookmarklets
function bookmarklets(cb) {
	gulp.src([`${src}/bookmarklets/*`])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(insert.prepend('javascript:(function(){'))
		.pipe(insert.append('})();'))
		.pipe(gulp.dest(`${dist}/bookmarklets`));
		cb();
};

// Watch for changes
function watch(cb) {
	gulp.watch(`${src}/js/**/*.js`, ['js']);
	gulp.watch(`${src}/less/**/*.less`, ['less']);
	gulp.watch(`${src}/gfx/*`, ['gfx']);
	gulp.watch(`${src}/bookmarklets/*.js`, ['bookmarklets']);
	cb();
};

// Setup local server with injection
function serve(cb) {
	server.init({
		proxy: 'localhost:' + config.port,
		notify: false
	});
	cb();
};

exports.default = gulp.parallel(css, js, gfx, bookmarklets);
exports.dev = gulp.parallel(css, js, gfx, bookmarklets, watch, serve);
