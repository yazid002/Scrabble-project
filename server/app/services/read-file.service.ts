import { Dictionary } from '@app/classes/dictionary';
import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class ReadFileService {
    async readDictionary(path: string): Promise<Dictionary> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(JSON.parse(data.toString()) as unknown as Dictionary);
            });
        });
    }
}
