var gulp = require('gulp'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  webpack = require('webpack'),
  webpackStream = require('webpack-stream'),
	webpackConfig = require('./webpack.config.js');

module.exports = function () {
  $.gulp.task('js:process', function() {
    return $.gulp.src($.path.app)
    	.pipe($.gp.sourcemaps.init())
	    .pipe($.gp.babel({
        presets: ['@babel/env']
      }))
      .pipe(webpackStream(webpackConfig))
      .on('error', console.error.bind(console))
      // .pipe($.gp.uglify())
      // .pipe($.gp.concat('app.js'))
      .pipe($.gp.sourcemaps.write())
      .pipe($.gulp.dest($.config.root + '/assets/js'));
  });
};



