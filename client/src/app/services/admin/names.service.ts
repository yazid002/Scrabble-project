import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SERVER_URL } from '@app/constants/url';
interface NameProperties {
    name: string;
    default: boolean;
    isAdvanced: boolean;
}
@Injectable({
    providedIn: 'root',
})
export class NamesService {
    beginnerNames: NameProperties[];
    advancedNames: NameProperties[];
    urlString: string;

    constructor(private http: HttpClient) {
        this.urlString = SERVER_URL + '/api/virtual/';
    }

    async fetchNames() {
        this.beginnerNames = [];
        this.advancedNames = [];
        const response = this.http.get<NameProperties[]>(this.urlString);
        response.subscribe((nameProperties) => {
            this.beginnerNames = nameProperties.filter((nameProperty) => !nameProperty.isAdvanced);
            this.advancedNames = nameProperties.filter((nameProperty) => nameProperty.isAdvanced);

        });
    }
    async addName(name: string, isAdvanced: boolean) {
        const nameObj: NameProperties = { name, default: false, isAdvanced };
        const response = this.http.post<NameProperties>(this.urlString + 'add', nameObj);
        response.subscribe();
        await this.fetchNames();
    }
    validateFormat(name: string): boolean {
        if (name === 'allo') return true;
        return false;
    }
}
