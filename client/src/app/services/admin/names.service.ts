import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
    connectionEstablished: boolean;
    error: boolean;
    errorResponse: HttpErrorResponse;
    beginnerNames: NameProperties[];
    advancedNames: NameProperties[];
    urlString: string;

    constructor(private http: HttpClient) {
        this.beginnerNames = [{ name: 'patate', isAdvanced: false, default: true }];
        this.advancedNames = [{ name: 'tomate', isAdvanced: true, default: true }];
        this.urlString = SERVER_URL + '/api/virtual/';
        this.error = false;
    }
    async fetchNames() {
        const response = this.http.get<NameProperties[]>(this.urlString);
        response.subscribe(
            (nameProperties) => {
                this.connectionEstablished = true;
                this.assignNames(nameProperties);
            },
            (error) => this.handleError(error),
        );
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
        const response = this.http.post<void>(this.urlString + 'delete', name);
        response.subscribe(async () => this.fetchNames());
    }
    getRandomName(mode: string): string {
        const arrayMap: Map<string, NameProperties[]> = new Map([
            ['beginner', this.beginnerNames],
            ['advanced', this.advancedNames],
        ]);
        const rightArray = arrayMap.get(mode) as NameProperties[];
        return rightArray[Math.floor(rightArray.length * Math.random())].name;
    }
    private handleError(errorResponse: HttpErrorResponse) {
        this.errorResponse = errorResponse;

        this.error = true;
    }
}
