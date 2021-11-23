import * as fs from 'fs';
import { Service } from 'typedi';

@Service()
export class ReadFileService {
    async readDictionary(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data.toString());
            });
        });
    }
}
