import path from 'path';
import { Logger } from 'tslog';

const sectionId = 'rosk';

// const sectionId = path.join(
//   path.basename(path.dirname(path.resolve(__dirname, '../../'))),
//   path.basename(path.dirname(__dirname)),
// );

const log = new Logger({
  type: 'pretty',
  name: sectionId,
  // speed up build via ignoring source map details
  hideLogPositionForProduction: process.env.NODE_ENV === 'production',

  // minimal output meta data info
  prettyLogTemplate: '{{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} {{name}} ',


  // available options ( reminder )
  // prettyLogTemplate: '{{yyyy}}.{{mm}}.{{dd}} {{hh}}:{{MM}}:{{ss}}:{{ms}}\t{{logLevelName}}\t[{{filePathWithLine}}{{name}}]\t',
  // prettyErrorTemplate: '\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}',
  // prettyErrorStackTemplate: '  • {{fileName}}\t{{method}}\n\t{{filePathWithLine}}',
  // prettyErrorParentNamesSeparator: ':',
  // prettyErrorLoggerNameDelimiter: '\t',
  // stylePrettyLogs: true,
  // prettyLogTimeZone: 'UTC',
  // prettyLogStyles: {
  //   logLevelName: {
  //     '*': ['bold', 'black', 'bgWhiteBright', 'dim'],
  //     SILLY: ['bold', 'white'],
  //     TRACE: ['bold', 'whiteBright'],
  //     DEBUG: ['bold', 'green'],
  //     INFO: ['bold', 'blue'],
  //     WARN: ['bold', 'yellow'],
  //     ERROR: ['bold', 'red'],
  //     FATAL: ['bold', 'redBright'],
  //   },
  //   dateIsoStr: 'white',
  //   filePathWithLine: 'white',
  //   name: ['white', 'bold'],
  //   nameWithDelimiterPrefix: ['white', 'bold'],
  //   nameWithDelimiterSuffix: ['white', 'bold'],
  //   errorName: ['bold', 'bgRedBright', 'whiteBright'],
  //   fileName: ['yellow'],
  // },
}, {
  main: true,
  sub: false,
});

function getSubLogger(options: { context: string }) {
  return log.getSubLogger({ name: options.context }, { main: false, sub: true });
}

export { getSubLogger, log };

