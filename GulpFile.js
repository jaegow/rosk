
var gulp = require('gulp');
var gulp_util = require('gulp-util');
var gulp_clean = require('gulp-clean');
var gulp_sass = require('gulp-sass');
var gulp_sequence = require('gulp-sequence').use(gulp);
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var browserSync = require('browser-sync');
// var gulp_sourcemaps = require('gulp-sourcemaps');
var styleguidist = require('react-styleguidist');


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
  directory: config.src + '/js',
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
config.compiled = config.build + '/compiled'
config.sg = {
  build: config.build + '/style-guide'
};

var browserSync_app = browserSync.create('app');
var browserSync_sg = browserSync.create('sg');

gulp.task('clean', function(callback) {
  return gulp.src(config.build, {read: false})
    .pipe(gulp_clean());
});
gulp.task('sass', function(callback) {
  return gulp.src(config.sass.glob)
    .pipe(gulp_sass())
    .on('error', function(err){
      browserSync_app.notify(err.message);
      this.emit('end');
    })
    .pipe(gulp.dest(config.css.build.directory))
    .pipe(browserSync_app.stream({match: "**/*.css"}));
});

// todo: don't use this... separate and remove need to recompile html file when other webpack changes happen
var webpackPlugin_html = new HtmlWebpackPlugin({
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

// var webpackPlugin_uglify = new UglifyJsPlugin({
//   test: /\.jsx$/,
//   sourceMap: true,
//   uglifyOptions: {
//     mangle: false
//   },
//   compress: {
//
//   }
// });

// var webpackPlugin_uglify = new UglifyJsPlugin({
//   sourceMap: true,
//   mangle: false
// });

const srcWebpackConfig = {
  entry: config.js.entry,
  output: {
    path: config.js.output.directory,
    filename: config.js.output.fileName
  },
  devtool: "source-map",
  resolve: {
    modules: [config.js.directory, "node_modules"], // add the js src directory to avoid relative paths for your imports
    extensions: [".js", ".jsx"] // make sure to include all the javascript exstensions you need
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


  return webpack(srcWebpackConfig, function(error, stats) {
    console.log('*** webpack');
    //console.log('*** webpack stats', stats.compilation.errors.length);
    if(stats.compilation.errors.length) {
      console.log('*** webpack error', stats.compilation.errors);
      browserSync_app.notify("" + stats.compilation.errors, 8000);
      // throw new gulp_util.PluginError('webpack', error);
    } else {
      browserSync_app.stream({match: "**/*.js"});
    }
    callback();
    // console.log('*** webpack stats', stats);
    // if(error) {
    //   console.log('*** webpack error', error);
    //   browserSync_app.notify(error);
    //   throw new gulp_util.PluginError('webpack', error);
    // }
    // gulp_util.log('[webpack]', stats.toString({colors: true, progress: true}));
  });
});

gulp.task('browser-sync-app', function(callback) {
  browserSync_app.init({
    server: config.build,
    port: 8080,
    browser: "google chrome",
    // todo: create multiple instance of browser-sync to support the below middleware below while also supporting multiple endpoints so you can view the generated styleguide as wekll
    middleware: [
      require('connect-history-api-fallback')() // used to redirect all server traffic through the root directory
    ],
    ui: { port: 8081 },
    files: [config.js.output.file, config.html.build, config.css.build.file]
  });
  callback();
  // browserSync.notify('<span style="color: grey">Running:</span>');
});


gulp.task('browser-sync-sg', function(callback) {
  browserSync_sg.init({
    server: config.sg.build,
    port: 8082,
    browser: "google chrome",
    ui: { port: 8082 },
    files: [config.sg.build + '/index.html']
  });
  callback();
});

gulp.task('watch-dev', function(callback) {
    gulp.watch(config.js.glob.src, ['webpack']);
    gulp.watch(config.html.src, ['webpack']);
    gulp.watch(config.sass.glob, ['sass']);
    callback();
});

gulp.task('watch-dev-sg', function(callback) {
    gulp.watch(config.js.glob.src, ['webpack', 'styleguidist']);
    gulp.watch(config.html.src, ['webpack']);
    gulp.watch(config.sass.glob, ['sass', 'styleguidist']);
    callback();
});

gulp.task('styleguidist', function(callback) {
  var styleguide = styleguidist({
      logger: {
          warn: console.warn,
          info: console.log,
          debug: console.log
      },
      styleguideDir: config.sg.build,
      components: config.js.glob.src,
      webpackConfig: srcWebpackConfig
  });
  styleguide.build( function(err, config) {
      if (err) {
          console.log(err)
      } else {
          return callback();
          console.log('Style guide published to', config.styleguideDir)
      }
    }
  );
});

gulp.task('dev', function (callback) {
    gulp_sequence('clean', 'sass', 'webpack', 'browser-sync-app', 'watch-dev')(callback);
});

gulp.task('dev-sg', function (callback) {
    gulp_sequence('clean', 'sass', 'webpack', 'styleguidist', 'browser-sync-app', 'browser-sync-sg', 'watch-dev-sg')(callback);
});

