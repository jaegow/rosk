import { Logger } from 'tslog';

const log = new Logger({
    type: 'pretty',
    name: 'pos',
    // speed up build via ignoring source map details
    hideLogPositionForProduction: process.env.NODE_ENV === 'production',
    // minimal output meta data info
    prettyLogTemplate: '{{logLevelName}} {{name}} ',
}, { main: true, sub: false });

function getSubLogger(options: { context: string }) {
    return log.getSubLogger({ name: options.context }, { main: false, sub: true });
}

export { getSubLogger, log };

