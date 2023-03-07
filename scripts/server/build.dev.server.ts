/* eslint-env node */
require('dotenv').config();
import path from 'path';
import { getSubLogger } from "../shared/utils/log";
import devServer, { DevServerOptions } from "./devServer";

const log = getSubLogger({ context: 'dev-server-test' });

(async () => {
    log.info('Start');
    try {
        await devServer({
            port: 4200,
            browser: process.env.DEV_BROWSER,
            public: path.resolve(__dirname, '../../client/public')
        });
        log.info('Done');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})()
