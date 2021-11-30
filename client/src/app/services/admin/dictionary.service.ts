/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable prettier/prettier */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    listDictionaries: TitleDescriptionOfDictionary[] = [];

    url: string = 'http://localhost:3000/api/admin/dictionary';
    constructor(private http: HttpClient) {}

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
        this.http.delete<string>('http://localhost:3000/api/admin/dictionary/delete/' + filename).subscribe(async (rep) => {
            // TODO a implementer
            console.log(rep);
            await this.getAllDictionaries();
        });
    }
}
