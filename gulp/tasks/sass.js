'use strict';

module.exports = function() {
  $.gulp.task('sass', function() {
    return $.gulp.src('./source/style/app.scss')
      // .pipe($.gp.sourcemaps.init())
      .pipe($.gp.sassGlob())
      .pipe($.gp.sass({
        includePaths: require("node-normalize-scss").includePaths
      })).on('error', $.gp.notify.onError({ title: 'Style' }))
      .pipe($.gp.autoprefixer({overrideBrowserslist:['last 2 versions']}))
      // .pipe($.gp.cssunit({
      // 	type : 'px-to-rem',
      // 	rootSize : 16
      // }))
      .pipe($.gp.groupCssMediaQueries())
      .pipe($.gp.cleanCss())
      // .pipe($.gp.sourcemaps.write())
      .pipe($.gulp.dest($.config.root + '/assets/css'))
      .pipe($.browserSync.stream());
  })
};
