/* eslint-env node */
import fs from 'fs-extra';

const sectionId = 'copyFiles';

type CopyFilesOption = { from: string, to: string };

/**
 * copy
 */
const copyFiles = async (options: CopyFilesOption[]) => {
    console.info(`COPY FILES STARTED`, { files: options });
    const fileOptions = options.filter((copyOption) => copyOption && copyOption.to && copyOption.from && copyOption.to !== copyOption.from);
    if (fileOptions && fileOptions.length) {
        await Promise.all(fileOptions.map(({from, to}) => fs.copy(from, to)));
    }
    console.info(`COPY FILES COMPLETE`, { files: options });
};

export default copyFiles;
export type { CopyFilesOption };
