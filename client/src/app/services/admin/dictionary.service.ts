/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable prettier/prettier */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    url: string = 'http://localhost:3000/api/admin/dictionary';

    constructor(private http: HttpClient) {}

    public getAllDictionaries(): Observable<TitleDescriptionOfDictionary[]> {
        return this.http.get<TitleDescriptionOfDictionary[]>(this.url + '/findAll');
    }

    public televerser(fileToUpload: File): Observable<boolean> {
        const endpoint = 'your-destination-url';
        const formData: FormData = new FormData();
        formData.append('fileKey', fileToUpload, fileToUpload.name);
        return this.http
          .post(endpoint, formData, { headers: yourHeadersConfig })
          .map(() => { return true; })
          .catch((e) => this.handleError(e));
    }
}
