/* eslint-env node */
require('dotenv').config();

// paths built in sequence for objectification
import path from 'path';
import build from "./build";
import {getSubLogger} from "../utils/log";

const sectionId = 'watch';

const log = getSubLogger({ context: sectionId });

process.env.NODE_ENV = 'development';

(async () => {
    log.info('Starting Local Dev');

    try {
        const paths = { root: path.resolve(__dirname, '../../') };
        log.info({paths});

        await build({
            paths: {
                ...paths,
                src: path.join(paths.root, 'client/src'),
                build: path.join(paths.root, 'client/public/build'),
                public: path.join(paths.root, 'client/public'),
                // dist: path.join(paths.root, 'client/dist'),
                serveFrom: path.join(paths.root, 'client/public'),
            },
            templates: [{
                file: 'index.template.html',
                entryMatcher: /index[\s\S]*\.js(?!\.)/,
                from: path.join(paths.root, 'client/public', '/index.template.html'),
                to: path.join(paths.root, 'client/public', '/index.html'),
            }],
            config: {
                esBuild: {
                    entryPoints: [ path.join(paths.root, 'client/src/index.tsx') ],
                    splitting: true,
                    format: 'esm',
                    bundle: true,
                    sourcemap: true,
                },
                browserSync: {
                    port: 4100,
                }
            },
            watch: true,
            serve: true,
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})()

