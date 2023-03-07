/* eslint-env node */
import fs from 'fs-extra';

// import { getSubLogger } from './logger';
// const sectionId = 'readWriteFile';
// const log = getSubLogger(sectionId);

const readWriteFile = (from: string, to: string, onData: (data: string) => string) =>
    new Promise<void>((resolve, reject) => {
        fs.readFile(from, 'utf8', (err, data) => {
            if (err) return reject(err);
            const result = onData(data.toString());
            fs.writeFile(to, result, 'utf8', (err) => {
                if (err) return reject(err);
                return resolve();
            });
        });
    });

export default readWriteFile;
