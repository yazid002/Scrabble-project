/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable prettier/prettier */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '@app/constants/url';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    listDictionaries: TitleDescriptionOfDictionary[] = [];

    url: string;
    constructor(private http: HttpClient) {
        this.url = SERVER_URL + '/api/admin/dictionary';
    }

    // public getAllDictionaries(): Observable<TitleDescriptionOfDictionary[]> {
    //   return this.http.get<TitleDescriptionOfDictionary[]>(this.url + '/findAll');
    // }
    public async getAllDictionaries(): Promise<TitleDescriptionOfDictionary[]> {
        await this.http
            .get<TitleDescriptionOfDictionary[]>(this.url + '/findAll')
            .toPromise()
            .then((res) => {
                this.listDictionaries = res;
            });
        return this.listDictionaries;
    }
    async deleteDictionary(filename: string) {
        this.http.delete<string>(this.url +'/delete/' + filename).subscribe(async (rep) => {
            // TODO a implementer
            console.log(rep);
            this.getAllDictionaries();
        });
    }
}
