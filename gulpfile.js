const server = require('browser-sync');
const { src, dest, series, parallel, watch } = require('gulp');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const insert = require('gulp-insert');
const plumber = require('gulp-plumber');
require('dotenv').config();

const srcDir = './assets';
const distDir = './public';

// Compile less
function css(cb) {
	return src([`${srcDir}/less/app.less`])
		.pipe(plumber())
		.pipe(less())
		.pipe(dest(`${distDir}/css`))
		.pipe(server.stream());
}

// Compile javascrip
function js(cb) {
	return src([`${srcDir}/js/main.js`])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(dest(`${distDir}/js`))
		.pipe(server.stream());
}

// Copy graphics
function gfx(cb) {
	return src(`${srcDir}/gfx/*`).pipe(dest(`${distDir}/gfx`));
}

// Compile bookmarklets
function bookmarklets(cb) {
	return src([`${srcDir}/bookmarklets/*`])
		.pipe(plumber())
		.pipe(uglify())
		.pipe(insert.prepend('javascript:(function(){'))
		.pipe(insert.append('})();'))
		.pipe(dest(`${distDir}/bookmarklets`));
}

// Watch for changes
function watchFiles(cb) {
	watch(`${srcDir}/js/**/*.js`, js);
	watch(`${srcDir}/less/*.less`, css);
	watch(`${srcDir}/gfx/*`, gfx);
	watch(`${srcDir}/bookmarklets/*.js`, bookmarklets);
	cb();
}

// Setup local server with injection
function serve(cb) {
	server.init({
		proxy: 'localhost:' + process.env.PORT,
		notify: false,
	});
	cb();
}

exports.default = parallel(css, js, gfx, bookmarklets);
exports.dev = parallel(css, js, gfx, bookmarklets, watchFiles, serve);
