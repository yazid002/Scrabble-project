import { Component, ElementRef, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileMessages } from '@app/pages/admin-page/models/file-messages.model';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';
import { ValidationMessageModel } from '@app/pages/admin-page/models/validation-message.model';
import { DictionaryService } from '@app/services/admin/dictionary.service';

@Component({
    selector: 'app-dictionary-options',
    templateUrl: './dictionary-options.component.html',
    styleUrls: ['./dictionary-options.component.scss'],
})
export class DictionaryOptionsComponent implements OnInit {
    titleAndDescriptionOfDictionary: TitleDescriptionOfDictionary = {
        title: '',
        description: '',
    };
    newDictionary: File;
    validationMessage: ValidationMessageModel = {
        isValid: true,
        message: '',
    };
    fileMessage: FileMessages = {
        isuploaded: true,
        message: '',
    };
    myInputVariable: ElementRef;
    constructor(public dictionaryService: DictionaryService, private snackBar: MatSnackBar) {
        this.dictionaryService.snackBarSignal.subscribe((snack: { message: string; action: string }) => {
            this.openSnackBar(snack.message, snack.action);
        });
    }

    async ngOnInit(): Promise<void> {
        await this.dictionaryService.getAllDictionaries();
    }

    // Disable the any lint filer because it is hard to know the type of an event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async selectDictionary(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.dictionaryService.selectDictionary(file);
        }
    }

    openSnackBar(message: string, action: string) {
        const snackBarRef = this.snackBar.open(message, action, { duration: 5000 });
        snackBarRef.onAction().subscribe(() => {
            snackBarRef.dismiss();
        });
    }
}
