
var gulp = require('gulp');
var gulp_util = require('gulp-util');
var gulp_clean = require('gulp-clean');
var gulp_sass = require('gulp-sass');
var gulp_sequence = require('gulp-sequence').use(gulp);
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var browserSync = require('browser-sync');

const config = {
  isProd: gulp_util.env.prod !== undefined, // gulp_util.env picks up args, ie - gulp --prod || gulp --dev
  root: __dirname
};
config.src = config.root + '/src';
config.build = config.root + '/' + (config.isProd ? 'build/prod' : 'build/dev'); // dev || prod condition
config.html = {
  src : config.src + '/index.html',
  build: config.build + '/index.html'
};
config.sass = {
  glob: config.src + '/sass/**/*.scss',
};
config.css = {
  build: {
    directory: config.build + '/css',
    fileName: 'main.css'
  }
};
config.css.build.file = config.css.build.directory + '/' +  config.css.build.fileName;
config.js = {
  glob: {
    src: config.src + '/js/**/*.*',
  },
  entry: config.src+ '/js/main.jsx',
  output: {
    directory: config.build + '/js',
    fileName: 'bundle.js'
  }
};
config.js.output.file = config.js.output.directory + '/' + config.js.output.fileName;


gulp.task('clean', function(callback) {
  return gulp.src(config.build, {read: false})
    .pipe(gulp_clean());
});
gulp.task('sass', function(callback) {
  return gulp.src(config.sass.glob)
    .pipe(gulp_sass().on('error', gulp_sass.logError))
    .pipe(gulp.dest(config.css.build.directory));
});

// todo: don't use this... separate and remove need to recompile html file when other webpack changes happen
const webpackPlugin_html = new HtmlWebpackPlugin({
  template: config.html.src,
  filename: config.html.build,
  // custom template props
  title: 'ROSK',
  css: 'css/' + config.css.build.fileName,
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
          presets: ['@babel/preset-env', '@babel/preset-react']
          // plugins: ['@transform-react-jsx'] // todo: transform runtime for smaller file size
        }
      }
    ]
  },
  plugins: [webpackPlugin_html] // todo: add webpackPlugin_uglify for prod only
};
gulp.task('webpack', function(callback) {
  // run webpack
  return webpack(webpackConfig, function(error, stats) {
    if(error) throw new gulp_util.PluginError('webpack', error);
    gulp_util.log('[webpack]', stats.toString({colors: true, progress: true}));
    callback();
  });
});

gulp.task('browser-sync', () => {
  browserSync.init({
    server: config.build,
    port: 8080,
    browser: "google chrome",
    middleware: [
      require('connect-history-api-fallback')() // used to redirect all traffic through the server root directory
    ],
    ui: { port: 8081 },
    files: [config.js.output.file, config.html.build, config.css.build.file]
  });
  browserSync.notify('<span style="color: grey">Running:</span>');
});

gulp.task('watch', () => {
  gulp.watch(config.js.glob.src, ['webpack']);
  gulp.watch(config.html.src, ['webpack']);
  gulp.watch(config.sass.glob, ['sass']);
});

gulp.task('default', function (callback) {
  gulp_sequence('clean', 'sass', 'webpack', 'browser-sync', 'watch')(callback);
});
