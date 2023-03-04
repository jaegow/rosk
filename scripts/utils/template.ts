/* eslint-env node */
import fs from 'fs-extra';
import readWriteFile from './readWriteFile';
import dot from 'dot';

const sectionId = 'template';

import { getSubLogger } from './log';

const log = getSubLogger({ context: sectionId });

type CompileTemplateOption = { file: string, from: string, to: string, entryMatcher: RegExp };

/**
 * injection of our entry point css & js
 * - if there is not a found file for css or js we inject an associated tag
 * - this is built for a single injection point for css & js
 * - the single file css and/or js file handles loading split files for css or js
 */
const compileTemplates = async (buildDir: string, templates: CompileTemplateOption[]) => {
    log.info(`INJECT HTML STARTED`, { buildDir, templates });
    const buildFiles = fs.readdirSync(buildDir);

    log.info(`INJECT`, {
        buildFiles,
    });

    await Promise.all(templates.map((template) => {
        let js_file_name;
        let css_file_name;
        buildFiles.forEach((fileName) => {
            if (template.entryMatcher) {
                if (template.entryMatcher.test(fileName)) {
                    js_file_name = fileName;
                }
            } else {
                // default to index.js
                if (/^index/.test(fileName)) {
                    if (/js$/.test(fileName)) {
                        js_file_name = fileName;
                    }
                }
            }
            // CSS File is always marked with index
            if (/^index/.test(fileName)) {
                if (/css$/.test(fileName)) {
                    css_file_name = fileName;
                }
            }
        });

        const css_path = `/build/${css_file_name}`;
        const js_path = `/build/${js_file_name}`;

        log.info(`INJECT`, {
            css_path,
            css_file_name,
            js_file_name,
            js_path,
        });


        const js_tag = js_file_name ? `<script defer="" type="module" src="${js_path}"></script>` : '';
        const css_tag = css_file_name ? `<link href="${css_path}" rel="stylesheet">` : '';
        const template_vars = { js_tag, css_tag };
        log.info(`INJECT HTML`, { template_vars });

        return readWriteFile(template.from, template.to, (data) => {
            const template = dot.template(data);
            const compiled = template(template_vars);
            return compiled;
        });
    }));
    log.info(`INJECT HTML COMPLETE`);
};

export { compileTemplates }
export type { CompileTemplateOption };
