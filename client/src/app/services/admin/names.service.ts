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
    }

    async fetchNames(): Promise<NameProperties[]> {
        this.names = [];
        const response = this.http.post<NameProperties[]>(this.urlString, '');
        response.subscribe((names) => (this.names = names));
        return this.names;
    }
}
