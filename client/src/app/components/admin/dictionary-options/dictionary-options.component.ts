/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-const */
/* eslint-disable no-empty */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
/* eslint-disable import/no-unresolved */
/* eslint-disable no-restricted-imports */
/* eslint-disable no-console */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable prettier/prettier */
import { Component, OnInit } from '@angular/core';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';
import { DictionaryService } from '@app/services/admin/dictionary.service';

@Component({
    selector: 'app-dictionary-options',
    templateUrl: './dictionary-options.component.html',
    styleUrls: ['./dictionary-options.component.scss'],
})
export class DictionaryOptionsComponent implements OnInit {
    listDictionaries: TitleDescriptionOfDictionary[] = [];
    newDictionary: any;
    isValid: boolean = true;
    errorMessage = '';

    constructor(private dictionaryService: DictionaryService, private http: HttpClient) {}

    ngOnInit(): void {}

    getAllDictionaries() {
        this.dictionaryService.getAllDictionaries().subscribe((resp) => {
            this.listDictionaries = resp;
            console.log('-----> list inside : ' + JSON.stringify(this.listDictionaries));
        });
    }

    addNewDictionary() {
        this.http.get('assets/dictionariesStorage/newDictionaryN1.json').subscribe((data) => {
            this.newDictionary = data;
            console.log('====> new dictionary = ' + JSON.stringify(this.newDictionary) + '   ===> size=' + Object.keys(this.newDictionary).length);
            this.validateDictionary();
        });
    }

    validateDictionary() {
        if (Object.keys(this.newDictionary).length !== 3) {
            this.isValid = false;
            this.errorMessage = 'le format json du dictionnaire doit avoir 3 cles, title, description et words';
            return;
        }
        Object.keys(this.newDictionary).forEach((key) => {
            if (key !== 'title' && key !== 'description' && key !== 'words') {
                this.isValid = false;
                this.errorMessage = 'le 3 cles d un dictionnaire sont : title, description et words';
                return;
            }
            if (key === 'title' || key === 'description') {
                let value = this.newDictionary[key];
                if (typeof value !== 'string' && value! instanceof String) {
                    this.isValid = false;
                    this.errorMessage = 'title et description doivent etre de type string';
                    return;
                }
            }
            if (key === 'words') {
            }
            // let value: any = this.newDictionary[key];
            // console.log('=====> key = ' + key + '    AND value = ' + value);
        });
    }
}
