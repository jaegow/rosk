import gulp from 'gulp'
import gulp_clean from 'gulp-clean'
import gulp_util from 'gulp-util'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import browserSync from 'browser-sync'
//
//
//
//
// config set up
//
const config = {
  isProd: gulp_util.env.prod !== undefined, // gulp_util.env picks up args, ie - gulp --prod || gulp --dev
  root: __dirname
};
config.src = `${config.root}/src`;
config.build = `${config.root}/${config.isProd ? 'build/prod' : 'build/dev'}`; // dev||prod condition
config.html = {
  src :`${config.src}/index.html`,
  build: `${config.build}/index.html`
};
config.js = {
  glob: {
    src: `${config.src}/js/**/*.*`,
  },
  entry: `${config.src}/js/main.jsx`,
  output: {
    directory: `${config.build}/js`,
    fileName: 'bundle.js'
  }
};
config.js.output.file = `${config.js.output.directory}/${config.js.output.fileName}`;
//
//
//
//
// clean task
//
gulp.task('clean', () => {
  return gulp.src(config.build, {read: false})
    .pipe(gulp_clean());
});
//
//
//
//
// webpack config
//
const webpackPlugin_html = new HtmlWebpackPlugin({
  template: config.html.src,
  filename: config.html.build,
  // minify in prod only
  minify: !config.isProd ? {} : {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  },
  inject: true,
});
const webpackPlugin_uglify = new webpack.optimize.UglifyJsPlugin({
  compress: {
    warnings: false
  }
});
const webpackConfig = {
  entry: config.js.entry,
  output: {
    path: config.js.output.directory,
    filename: config.js.output.fileName
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/,
        query: {
          cacheDirectory: true,
          presets: ['env'],
          plugins: ['transform-react-jsx', 'transform-runtime']
        }
      }
    ]
  },
  plugins: [webpackPlugin_html, ...(config.isProd ? [webpackPlugin_uglify] : [])]
};
//
//
//
//
// webpack task
//
gulp.task('webpack', (callback) => {
  // run webpack
  webpack(webpackConfig, (error, stats) => {
    if(error) throw new gulp_util.PluginError('webpack', error);
    gulp_util.log('[webpack]', stats.toString({colors: true, progress: true}));
    callback();
  });
});
//
//
//
//
// browser-sync task
//
gulp.task('browser-sync', () => {
  browserSync.init({
    server: config.build,
    ui: { port: 8080 },
    files: [config.js.output.file, config.html.build]
  });
});
//
//
//
//
// watch tasks
//
gulp.task('watch', () => {
  gulp.watch(config.js.glob.src, ['webpack']);
  gulp.watch(config.html.src, ['webpack']);
});
//
//
//
//
// $ gulp
//
gulp.task('default', ['clean', 'webpack', 'browser-sync', 'watch']);