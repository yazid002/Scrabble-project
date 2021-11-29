import { HttpClient } from '@angular/common/http';
/* eslint-disable arrow-parens */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { DictionaryModel } from '@app/pages/admin-page/models/dictionary.model';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';
import { DictionaryService } from '@app/services/admin/dictionary.service';
import { InteractionService } from './../../../services/admin/interaction.service';
// import { FileMessages } from '../../../pages/admin-page/models/file-messages.model';
// import { ValidationMessageModel } from './../../../pages/admin-page/models/validation-message.model';
import { DictionaryFormComponent } from './../dictionary-form/dictionary-form.component';

@Component({
    selector: 'app-dictionary-options',
    templateUrl: './dictionary-options.component.html',
    styleUrls: ['./dictionary-options.component.scss'],
})
export class DictionaryOptionsComponent implements OnInit {
    listDictionaries: TitleDescriptionOfDictionary[] = [];
    matDialogRef: any;
    constructor(
        private dictionaryService: DictionaryService,
        public matDialog: MatDialog,
        private interactionService: InteractionService,
        private http: HttpClient,
    ) {}

    async ngOnInit(): Promise<void> {
        this.interactionService.uploadingFileMessage$.subscribe(async (message: string) => {
            this.listDictionaries.length = 0;
            if (message === 'ok') {
                await this.getAllDictionaries();
                this.closeDialog();
            }
        });
        await this.getAllDictionaries();
    }

    async getAllDictionaries() {
        this.listDictionaries.length = 0;
        const res: any = await this.dictionaryService.getAllDictionaries();
        this.listDictionaries = res;
    }

    addNewDictionaryInDialogMat() {
        this.matDialogRef = this.matDialog.open(DictionaryFormComponent, {
            width: '500px',
            minHeight: '400px)',
        });
    }

    closeDialog() {
        this.matDialogRef.close();
    }
    updateDictionary(/* dictionary: TitleDescriptionOfDictionary*/) {
        // TODO a implementer
    }

    deleteDictionary(filename: string) {
        this.http.delete('http://localhost:3000/api/admin/dictionary/delete/' + filename).subscribe((/* rep: string*/) => {
            // TODO a implementer
        });
    }

    onCancel() {
        // this.isAddNewDictionarySelected = false;
    }
}
