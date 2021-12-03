import { Dictionary } from '@app/classes/dictionary';
import { FileMessages } from '@app/classes/file-messages';
import { TitleDescriptionOfDictionary } from '@app/classes/title-description-of-dictionary';
import * as fs from 'fs';
import { Service } from 'typedi';
import { ReadFileService } from './read-file.service';
@Service()
export class DictionaryService {
    path: string;
    fileMessages: FileMessages = {
        isSuccess: true,
        message: '',
    };
    dictionaries: Dictionary[] = [];
    constructor(private readFileService: ReadFileService) {
        this.path = './app/assets/';
        this.readFileService.readDictionary(this.path + 'dictionnary.json').then((dict) => {
            const newDict = dict;
            newDict.default = true;
            this.dictionaries.push(newDict);
        });
    }
    async addDict(fileName: string) {
        await this.readFileService.readDictionary(this.path + fileName).then((dict) => {
            const newDict = dict;
            newDict.default = false;
            this.dictionaries.push(newDict);
            fs.unlinkSync(this.path + fileName);
        });
    }

    deleteDictionary(name: string): string {
        this.dictionaries = this.dictionaries.filter((dict) => dict.default || (!dict.default && dict.title !== name));
        return 'file removed successfully';
    }

    findAllDictionaries(): TitleDescriptionOfDictionary[] {
        return this.dictionaries.map((dict) => ({ title: dict.title, description: dict.description }));
    }
    getDictionary(name: string): Dictionary | undefined {
        return this.dictionaries.find((dict) => dict.title === name);
    }
}
