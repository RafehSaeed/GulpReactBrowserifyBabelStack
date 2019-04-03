"use strict"

var gulp = require('gulp');
var connect = require('gulp-connect');// runs local dev server
var open = require('gulp-open')// open urkl in browser
var browserify = require("browserify");
var reactify = require("reactify");
var source = require("vinyl-source-stream");

var config = {
	port: 8001,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html', //globs that looks like regix
		js :'./src/**/*.js',
		dist: './dist',
		mainJs: './src/main.js'
	}
}
//  Start a server 
gulp.task('connect',function(){
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	})
});

gulp.task('open', ['connect'] , function(){
	gulp.src('./dist/index.html').pipe(open({ uri : config.devBaseUrl + ':' + config.port + '/'}));
});

gulp.task('html', function(){

	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload())
});

// Watches file so every time a change is made the browser is reloaded 
gulp.task('watch', function(){
	gulp.watch(config.paths.html , ['html']);
	gulp.watch(config.paths.html , ['js']);
});


gulp.task('js',function(){
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

gulp.task('default', ['html' , 'js' ,'open' , 'watch']);