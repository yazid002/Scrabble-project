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
    beginnerNames: NameProperties[] = [];
    advancedNames: NameProperties[] = [];
    urlString: string;

    constructor(private http: HttpClient) {
        this.urlString = SERVER_URL + '/api/virtual/';
    }

    async fetchNames() {
        const response = this.http.get<NameProperties[]>(this.urlString);
        response.subscribe((nameProperties) => this.assignNames(nameProperties));
    }
    assignNames(nameProperties: NameProperties[]) {
        this.beginnerNames = nameProperties.filter((nameProperty) => !nameProperty.isAdvanced);
        this.advancedNames = nameProperties.filter((nameProperty) => nameProperty.isAdvanced);
    }
    async addName(name: string, isAdvanced: boolean) {
        const nameObj: NameProperties = { name, default: false, isAdvanced };
        const response = this.http.post<NameProperties>(this.urlString + 'add', nameObj);
        response.subscribe(async () => this.fetchNames());
    }
    async reset() {
        const response = this.http.get<void>(this.urlString + 'reset');
        response.subscribe(async () => this.fetchNames());
    }
    async delete(name: NameProperties) {
        const response = this.http.post<NameProperties>(this.urlString + 'delete', name);
        response.subscribe(async () => this.fetchNames());
    }

}
