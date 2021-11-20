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
    names: NameProperties[];
    urlString: string;

    constructor(private http: HttpClient) {
        this.urlString = SERVER_URL + '/api/virtual/';
        // this.fetchNames();
        // this.addName('allo', false);
    }

    async fetchNames(): Promise<NameProperties[]> {
        this.names = [];
        const response = this.http.get<NameProperties[]>(this.urlString);
        response.subscribe((names) => (this.names = names));
        return this.names;
    }
    async addName(name: string, isAdvanced: boolean) {
        const nameObj: NameProperties = { name, default: false, isAdvanced };
        const response = this.http.post<NameProperties>(this.urlString + 'add', nameObj);
        response.subscribe((names) => this.names.push(names));
        await this.fetchNames();
    }
    validateFormat(name: string): boolean {
        if (name === 'allo') return true;
        return false;
    }
}
