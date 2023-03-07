/* eslint-env node */
import browserSync, { Options as BrowserSyncOptions } from 'browser-sync';
import path from 'path';
import { execSync } from 'child_process';
import esbuild, { BuildOptions as ESBuildOptions } from 'esbuild';
import fs from 'fs-extra';
import copyFiles, { CopyFilesOption } from './utils/copyFiles';
import { compileTemplates, CompileTemplateOption } from './utils/template';
import historyApiFallback from 'connect-history-api-fallback';

import { getSubLogger } from './utils/log';

const sectionId = 'scripts/client/build';
const log = getSubLogger({ context: sectionId });

type BuildOptions = {
    copy?: CopyFilesOption[];
    templates?: CompileTemplateOption[];
    paths: { public: string, src: string, build: string, serveFrom?:string; dist?: string;  };
    config: {
        esBuild?: Omit<ESBuildOptions, 'outdir'>;
        browserSync?: Omit<BrowserSyncOptions, 'server'>;
    }
    serve?: boolean;
    watch?: boolean;
    analyze?: boolean;
}

const build = async (options: BuildOptions) => {
    try {
        log.info(sectionId, { options });
        log.info('BUILD STARTED');

        const esbuildConfig = { ...(options.config.esBuild || {}) };
        esbuildConfig.define = {
            // 'process.env': JSON.stringify(appEnv),
            // override if need be
            ...(esbuildConfig.define || {}),
        }

        log.info('esbuild config define', { define: esbuildConfig.define });

        if (!options.paths) throw new Error('!options.paths');
        if (!options.paths.build) throw new Error('!options.paths.build');

        // used with watch ignore so we save these here
        const analyzePaths = {
            metadata: path.join(options.paths.build, 'metadata.json'),
            analysis: path.join(options.paths.build, 'analysis.txt'),
        }

        // CLEAN STAGE
        const cleanPaths = [options.paths.build];
        if (options.paths.dist) cleanPaths.push(options.paths.dist);
        for (const directory of cleanPaths) {
            log.info(`CLEAN STARTED:`, directory);
            await execSync(`rm -rf ${directory}`);
            log.info(`CLEAN COMPLETE:`, directory);
        }

        // BUILD STAGE
        let ctx = await esbuild.context({
            // using our paths config for build out directory
            outdir: options.paths.build,
            // default(s)
            color: true,
            loader: {
                '.gif': 'dataurl',
                '.jpg': 'dataurl',
                '.png': 'dataurl',
            },
            ...esbuildConfig,
        });
        // kick off the first build as other steps require built files
        let built = await ctx.rebuild();

        if (options.templates) {
            log.info(`TEMPLATES STARTED`, options.templates);
            await compileTemplates(options.paths.build, options.templates);
            log.info(`TEMPLATES COMPLETE`);
        }

        if (options.paths.dist) {
            options.copy = options.copy || [];
            log.info(`DISTRIBUTION`, options.paths.dist);
            // with this being the last directory in the list
            // we copy all the content that has already been copied
            // into options.paths.build
            options.copy.push({ from: options.paths.build, to: options.paths.dist })
        }

        if (options.copy) {
            await copyFiles(options.copy);
        }

        if (options.analyze) {
            log.info(`ANALYZE STARTED`, { path: options.paths.build });
            await fs.writeFile(analyzePaths.metadata, JSON.stringify(built.metafile));
            if (built.metafile) {
                const analysis = await esbuild.analyzeMetafile(built.metafile, { verbose: true });
                await fs.writeFile(path.join(analyzePaths.analysis), analysis);
            }
            log.info(`ANALYZE COMPLETE`);
        }

        if (!options.serve) return ctx.dispose();

        // START SERVER STAGE
        if (!options.paths.serveFrom) throw new Error('options.serve && !options.paths.serveFrom');

        const serverOptions: BrowserSyncOptions = {
            // using our paths config for server directory
            server: options.paths.serveFrom,
            // default(s)
            browser: process.env.DEV_BROWSER || undefined,
            middleware: [
                // @ts-ignore
                historyApiFallback(),
            ],
            // ghostMode: https://browsersync.io/docs/options#option-ghostMode
            // Setting ghostMode to false disables mirroring of Clicks, Scrolls, and Form inputs across browsers.
            // These can be set individually like so:
            //   ghostMode: {
            //     clicks: true,
            //     forms: true,
            //     scroll: false,
            //   }
            ghostMode: false,
            ...(options.config.browserSync || {}),
        };
        log.info(`SERVER STARTED`, { options: serverOptions });
        const bs = browserSync.create();

        bs.init({...serverOptions });

        if (!options.watch) return ctx.dispose();

        if (!options.paths.public) throw new Error('options.watch && !options.paths.public');
        if (!options.paths.src) throw new Error('options.watch && !options.paths.src');

        log.info(`WATCH STARTED`);
        // FILE CHANGES/WATCHER STAGE
        const watchPatterns = [path.join(options.paths.src, '/**/*.{ts,tsx,json}'), path.join(options.paths.public, '/**/*')];
        const watchIgnorePatterns = [
            /(^|[\/\\])\../, // ignore dotfiles
            /.*.(unit|integ).test.tsx?$/, // ignore test files
            analyzePaths.metadata,
            analyzePaths.analysis,
        ];
        log.info(`WATCHING STARTED`, { watching: watchPatterns, watchingIgnored: watchIgnorePatterns });
        // incorrect types for bs.watch... should be an array of strings
        // @ts-ignore
        const watcher = bs.watch(watchPatterns, {
            ignored: watchIgnorePatterns,
            persistent: true,
        });

        // helper function during watch ops
        // - re-compile templates when their source file changes
        const templateFromPath = (filePath: string) => options.templates?.find(({ file }) => filePath.includes(file));

        watcher.on('ready', () => {
            watcher.on('all', async (eventType, filePath) => {
                log.info(`WATCHING:  FILE CHANGE`, { eventType, filePath });
                bs.notify("Compiling, please wait!", 1000);

                try {
                    const filePathTemplate = templateFromPath(filePath);
                    if (filePathTemplate) {
                        log.info(`TEMPLATE CHANGE`, { filePathTemplate });
                        // INDEX.HTML TEMPLATE STAGE
                        await compileTemplates(options.paths.build, [filePathTemplate]);
                        log.info(`BROWSER SYNC:  `, `bs.reload('*.html')`);
                        bs.reload('*.html');
                    } else {
                        // js things
                        built = await ctx.rebuild();
                        if (built.errors && built.errors.length) {
                            // OUTPUT BUILD INFO
                            bs.notify(
                                `HTML
                                        <p>Compilation Error:</p>
                                        <br/>
                                        <code>${JSON.stringify(built.errors, null, 2)}</code>
                                        `
                                ,
                                1000
                            );
                            log.info('Compilation Error\n', built.errors);
                        } else {
                            bs.reload('*.js');
                            log.info(`BROWSER SYNC: `, `bs.reload('*.js')`);
                        }
                    }
                } catch (error) {
                    log.error(error);
                    bs.notify(
                        `HTML
                                 <p>Compilation Error:</p>
                                 <br/>
                                 <code>${JSON.stringify(error, null, 2)}</code>
                                `
                        ,
                        1000
                    );
                }
            });
        });
    } catch (error) {
        log.error(error);
        throw error;
    }
};

export default build;
export type { BuildOptions };

