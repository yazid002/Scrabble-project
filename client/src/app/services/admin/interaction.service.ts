/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-invalid-this */
/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InteractionService {
    private _uploadingFileMessageSource = new Subject<string>();
    uploadingFileMessage$ = this._uploadingFileMessageSource.asObservable();

    constructor() {}

    sendMessage(message: string) {
        this._uploadingFileMessageSource.next(message);
    }
}
