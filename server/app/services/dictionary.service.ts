/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable prettier/prettier */
/* eslint-disable no-restricted-imports */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-parens */
import { Dictionary } from '@app/classes/dictionary';
import { FileMessages } from '@app/models/file-messages.model';
import { TitleDescriptionOfDictionary } from '@app/models/titleDescriptionOfDictionary.model';
import * as fs from 'fs';
import { Service } from 'typedi';
import { ReadFileService } from './read-file.service';
// import * as dictionaries from '../assets/list-dictionaries.json';

@Service()
export class DictionaryService {
    path: string;
    fileMessages: FileMessages = {
        isuploaded: true,
        message: '',
    };
    listDictionarires: Dictionary[] = [];
    constructor(private reafFileService: ReadFileService) {
        this.path = './app/assets/';
    }
    async addDict(fileName: string) {
        console.log('adding ', fileName);
        await this.reafFileService.readDictionary(this.path + fileName).then((dictString) => {
            const newDict = JSON.parse(dictString) as unknown as Dictionary;
            newDict.fileName = fileName;
            this.listDictionarires.push(newDict);
            console.log(this.listDictionarires);
            fs.unlinkSync(this.path + fileName);
        });
    }

    deleteFile(name: string): string {
        this.listDictionarires = this.listDictionarires.filter((dict) => dict.title !== name);
        return 'file removed successfully';
    }

    findAllDictionaries(): TitleDescriptionOfDictionary[] {
        return this.listDictionarires.map((dict) => ({ title: dict.title, description: dict.description }));
    }
}
