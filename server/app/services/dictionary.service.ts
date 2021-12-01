import { Dictionary } from '@app/classes/dictionary';
import { FileMessages } from '@app/models/file-messages.model';
import { TitleDescriptionOfDictionary } from '@app/models/titleDescriptionOfDictionary.model';
import * as fs from 'fs';
import { Service } from 'typedi';
import { ReadFileService } from './read-file.service';
@Service()
export class DictionaryService {
    path: string;
    fileMessages: FileMessages = {
        isuploaded: true,
        message: '',
    };
    dictionaries: Dictionary[] = [];
    constructor(private readFileService: ReadFileService) {
        this.path = './app/assets/';
        this.readFileService.readDictionary(this.path + 'dictionnary.json').then((dictString) => {
            const newDict = JSON.parse(dictString) as unknown as Dictionary;
            newDict.default = true;
            this.dictionaries.push(newDict);
        });
    }
    async addDict(fileName: string) {
        await this.readFileService.readDictionary(this.path + fileName).then((dictString) => {
            const newDict = JSON.parse(dictString) as unknown as Dictionary;
            newDict.default = false;
            this.dictionaries.push(newDict);
            fs.unlinkSync(this.path + fileName);
        });
    }

    deleteFile(name: string): string {
        this.dictionaries = this.dictionaries.filter((dict) => !dict.default && dict.title === name);
        return 'file removed successfully';
    }

    findAllDictionaries(): TitleDescriptionOfDictionary[] {
        return this.dictionaries.map((dict) => ({ title: dict.title, description: dict.description }));
    }
    getDictionary(name: string): Dictionary | undefined {
        return this.dictionaries.find((dict) => dict.title === name);
    }
}
