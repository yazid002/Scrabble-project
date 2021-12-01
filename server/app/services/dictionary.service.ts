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
    addDict(fileName: string) {
        console.log('adding ', fileName);
        this.reafFileService.readDictionary(this.path + fileName).then((dictString) => {
            this.listDictionarires.push(JSON.parse(dictString) as unknown as Dictionary);
            console.log(this.listDictionarires);
        });
    }
    saveTitleAndDescription(titleAndDescription: TitleDescriptionOfDictionary): FileMessages {
        try {
            // const path = './app/assets/list-dictionaries.json';
            // const data = fs.readFileSync(path, 'utf-8');
            // const list = this.listDictionarires;
            // this.listDictionarires.push(titleAndDescription);
            console.log(titleAndDescription.title);
            // fs.writeFileSync(path, JSON.stringify(list, null, 2));
            this.fileMessages.isuploaded = true;
            this.fileMessages.message = 'file has been successfully uploaded';
        } catch {
            this.fileMessages.isuploaded = false;
            this.fileMessages.message = 'file was not uploaded, server side problem';
        }
        return this.fileMessages;
    }

    deleteFile(filename: string): string {
        const path = './app/assets/' + filename;
        try {
            fs.unlinkSync(path);
            // this.listDictionarires = this.listDictionarires.filter((dict) => dict.filename !== filename);
            console.log(this.listDictionarires);
            return 'file removed successfully';
        } catch (err) {
            return 'file was not removed, server side problem';
        }
    }

    findAllDictionaries(): TitleDescriptionOfDictionary[] {
        return this.listDictionarires.map((dict) => ({ title: dict.title, description: dict.description }));
    }
}
