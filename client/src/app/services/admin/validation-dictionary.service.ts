/* eslint-disable no-console */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable } from '@angular/core';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';
import { DictionaryService } from '@app/services/admin/dictionary.service';
import { ValidationMessageModel } from './../../pages/admin-page/models/validation-message.model';

@Injectable({
    providedIn: 'root',
})
export class ValidationDictionaryService {
    listDictionalies: TitleDescriptionOfDictionary[] = [];
    titleAndDescriptionOfDictionary: TitleDescriptionOfDictionary;

    constructor(private dictionaryService: DictionaryService) {}

    findAllDictionaries() {
        this.dictionaryService.getAllDictionaries().subscribe((data) => {
            this.listDictionalies = data;
        });
    }

    validateNewDictionary(newFile: File): ValidationMessageModel {
        this.titleAndDescriptionOfDictionary.filename = newFile.name;
        console.log('====> length=' + Object.keys(newFile).length);
        return { isValid: true, message: '' };
    }
}
