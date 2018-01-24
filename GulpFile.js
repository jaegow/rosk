
var gulp = require('gulp');
var gulp_util = require('gulp-util');
var gulp_clean = require('gulp-clean');
var gulp_sass = require('gulp-sass');
var gulp_sequence = require('gulp-sequence').use(gulp);
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var browserSync = require('browser-sync');
// var gulp_sourcemaps = require('gulp-sourcemaps');
var recast = require("recast");
var fs = require('fs');
var gulp_read = require('gulp-read');
var gulp_file = require('gulp-file');
// var styleguidist = require('react-styleguidist');




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
    if(error) throw new gulp_util.PluginError('webpack', error);
    gulp_util.log('[webpack]', stats.toString({colors: true, progress: true}));
    callback();
  });
});

gulp.task('browser-sync', function(callback) {
  return browserSync.init({
    server: config.build,
    port: 8080,
    browser: "google chrome",
    // todo: create multiple instance of browser-sync to support the below middleware below while also supporting multiple endpoints so you can view the generated styleguide as wekll
    // middleware: [
    //   require('connect-history-api-fallback')() // used to redirect all server traffic through the root directory
    // ],
    ui: { port: 8081 },
    files: [config.js.output.file, config.html.build, config.css.build.file]
  });
  /// callback();
  // browserSync.notify('<span style="color: grey">Running:</span>');
});

gulp.task('watch', function(callback) {
  gulp.watch(config.js.glob.src, ['webpack']);
  gulp.watch(config.html.src, ['webpack']);
  gulp.watch(config.sass.glob, ['sass']);
  callback();
});

// var styleguidistConfig = {
//   // logger: {
//   //   warn: console.warn,
//   //   info: console.log,
//   //   debug: console.log
//   // },
//   // dangerouslyUpdateWebpackConfig(srcWebpackConfig, env) {
//   //   // WARNING: inspect Styleguidist Webpack config before modifying it, otherwise you may break Styleguidist
//   //   console.log('styleguidist webpackConfig', webpackConfig)
//   //   webpackConfig.plugins = [];
//   //   return webpackConfig;
//   // },
//   styleguideDir: config.build + '/styleguide',
//   components: config.src + '/js/**/*.{js,jsx}',
//   // styleguidist ignores: webpackConfig.entry, webpackConfig.externals, webpackConfig.output, webpackConfig.watch, and webpackConfigstats
//   webpackConfig: Object.assign({}, srcWebpackConfig, {
//     plugins: []
//   })
// };
//
// //console.log('styleguidistWebpackConfig', styleguidistWebpackConfig);
//
// gulp.task('styleguidist', function(callback) {
//   var styleguide = styleguidist(styleguidistConfig);
//   styleguide.build( function(err, config) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log('Style guide published to', config.styleguideDir)
//     }
//   });
//   return callback();
// });

// gulp.task('recast', function(callback) {
//   fs.readFile(config.js.output.file, 'utf8', function (err,data) {
//     if (err) {
//       return console.log(err);
//     }
//     // var result = recast.print(transform(recast.parse(source, {
//     //   sourceFileName: "bundle.js"
//     // })), {
//     //   sourceMapName: "bundle.js.map"
//     // });
//     //
//     // var output = result.code;
//
//     var ast = recast.parse(data);
//
//     var output = recast.print(ast).code;
//     // var output = recast.prettyPrint(ast, { tabWidth: 2 }).code;
//
//     console.log(output);
//     // JSON.stringify(ast)
//
//     // fs.appendFile(config.compiled + '/test.json', 'suck it', function (err) {
//     //   if (err) throw err;
//     //   console.log("The file was succesfully saved!");
//     // });
//
//     return gulp.src(config.compiled)
//       .pipe(file('primus.js', str))
//       .pipe(gulp.dest('dist'));
//
//
//     return callback();
//   });
// });


gulp.task('recast', function() {

  return gulp.src(config.js.output.file).pipe(zlib.createGzip()).pipe(fs.createWriteStream('file.txt.gz'));



  return gulp.src(config.js.output.file)
    .pipe(imagemin())
    .pipe(remember())
    .pipe(gulp.dest('dist/images'));
});



// gulp.task('default', function (callback) {
//   gulp_sequence('clean', 'sass', 'webpack', 'watch', 'browser-sync')(callback);
// });

gulp.task('default', function (callback) {
  gulp_sequence('clean', 'sass', 'webpack', 'recast')(callback);
});
