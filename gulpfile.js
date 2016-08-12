var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	del = require('del');
var plugins = require('gulp-load-plugins')();
var config = require('./config.json');
var browserSync = require('browser-sync').create('es6 server');

var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var buffer = require('vinyl-buffer');

var reload = browserSync.reload;

/*start --- concat and uglify js files */
gulp.task('minify-js', ['clean-js'], function () {
	return browserify({ entries: './src/js/index.js', debug: true })
		.transform("babelify", { presets: ["es2015"] })
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.uglify())
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.sourcemaps.write("."))
		.pipe(plugins.rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(config.build.js))
		.pipe(reload({
			stream: true
		}));
});
/*end --- concat and uglify js files */

/* start minify css */
gulp.task('minify-css', ['clean-css'], function () {
	return gulp.src(config.path.styles)
		.pipe(plugins.minifyCss())
		.pipe(plugins.concat('main.css'))
		.pipe(plugins.rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(config.build.css))
		.pipe(reload({
			stream: true
		}));
});
/* end minify css */

/*start clean*/
gulp.task('clean-js', function (cb) {
	del(['dest/js']).then(paths => {
		console.log('Deleted files and folders:\n', paths.join('\n'));
		cb();
	});
});
gulp.task('clean-css', function (cb) {
	del(['dest/css']).then(paths => {
		console.log('Deleted files and folders:\n', paths.join('\n'));
		cb();
	});
});
/*end clean*/

/*watch files change*/
gulp.task('serve', function () {
	browserSync.init({
		server: {
			baseDir: "./",
			index: "./src/html/index.html"
		},
		port: 9000,
		logPrefix: "My Awesome Project",
		logLevel: "info",
		browser: "google chrome"
	});

	gulp.watch(config.path.scripts, ['minify-js']).on('change', function (event) {
		console.log("the file in " + event.path + " has been " + event.type);
	});

	gulp.watch(config.path.styles, ['minify-css']).on('change', function (event) {
		console.log("the file in " + event.path + " has been " + event.type);
	});
});

/*run task*/
gulp.task('default', ['serve', 'minify-js', 'minify-css']);