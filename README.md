# React Opinionated Starter Kit (ROSK)

###### Global should haves
1. node / npm
1. gulp

##### Opinionated Manifesto 
###### most optimized && most understandable && most efficient
* lean on existing libs instead of writting your own implementation
  * promotes familiarity amoung other developers
  * faster learning curve with proven tool 
  * community driven development rounds the rough edges of personal implementation
  * attempt to only write your own when other libs fail to provide
* define your personal structure first !!!
  * why do you have this structure
* standards || rules
  * easily digestible code
  * descriptive & verbose over less lines
  * procedural
  * rapid dev by using small design bits || tokens
  * page to code
    * what the user sees should translate to code
    * view hierarchy should match code hierarchy
  * DESIGN SYSTEM DESIGN SYSTEM DESIGN SYSTEM DESIGN SYSTEM
    * create a new repo or npm module for css / design system
    * living style guide
  * Living API guide
    * code examples of all of API endpoints (internal use)
* optimization rules
  * https://www.sitepoint.com/10-ways-minimize-reflows-improve-performance
  * https://reactjs.org/docs/optimizing-performance

###### Useful notes
* HtmlWebpackPlugin
  * augments the index.html page
  * generates/copies the index.html page into it's respective folder

###### STARTING SERVER
* Start MongoDB Server
Open your terminal and from current directory run:
$ mongod
* Start Node Server
$ node client/server.js 

###### todo: 
* optimize webpack: https://github.com/webpack/docs/wiki/optimization
* https://github.com/davidhund/styleguide-generators#user-content-react
* https://www.youtube.com/watch?v=EiitCT_99XE&t=1359s
* https://reactjs.org/docs/typechecking-with-proptypes.html & https://github.com/styleguidist/react-styleguidist
* add data/api to style-guide, api urls, data schemas
* ? control statements ? https://www.npmjs.com/package/jsx-control-statements 
* start to finish step by step to create this starter kit
  * ie - $ touch gulpfile.babel.js  
* gulp-sourcemaps --dev
* webpack-dev-middleware --dev
* manifest.json -- https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json
* DESIGN SYSTEM:
  * vertical flow
  * grid (CSS Grid ??)
  * containers define layout
  * posters (background images)


###### justifications
* see optimization rules
* list some useful tidbits here

###### descriptions || key words
* react-starter-kit, react starter kit