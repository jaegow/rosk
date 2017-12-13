// config build procedure
import gulp_util from 'gulp-util'

const config = {
  isProd: gulp_util.env.prod !== undefined, // gulp_util.env picks up args, ie - gulp --prod || gulp --dev
  root: __dirname
};
config.src = `${config.root}/src`;
config.build = `${config.root}/${config.isProd ? 'build/prod' : 'build/dev'}`; // dev||prod condition
config.html = {
  glob :`${config.src}/index.html`
};
config.js = {
  glob: `${config.src}/js/*.*`,
  entry: `${config.src}/js/main.jsx`,
  build: `${config.build}/js`
};

export default config