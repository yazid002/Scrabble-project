/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-restricted-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable prettier/prettier */
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
/* eslint-disable prefer-const */
import { DictionaryModel } from '@app/pages/admin-page/models/dictionary.model';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';
import { ValidationMessageModel } from '@app/pages/admin-page/models/validation-message.model';
import { DictionaryService } from '@app/services/admin/dictionary.service';
import { FileMessages } from '../../../pages/admin-page/models/file-messages.model';
import { InteractionService } from './../../../services/admin/interaction.service';

@Component({
    selector: 'app-dictionary-form',
    templateUrl: './dictionary-form.component.html',
    styleUrls: ['./dictionary-form.component.scss'],
})
export class DictionaryFormComponent implements OnInit {
    listDictionaries: TitleDescriptionOfDictionary[] = [];
    titleAndDescriptionOfDictionary: TitleDescriptionOfDictionary = {
        filename: '',
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
    @ViewChild('myInput')
    myInputVariable: ElementRef;

    constructor(
        private http: HttpClient,
        private dictionaryService: DictionaryService,
        private snackBarService: MatSnackBar,
        private interactionService: InteractionService,
    ) {}

    ngOnInit() {
        this.getAllDictionaries();
    }
    async getAllDictionaries() {
        const res: any = await this.dictionaryService.getAllDictionaries();
        this.listDictionaries = res;
    }

    async selectDictionary(event: any) {
        if (event.target.files.length > 0) {
            this.newDictionary = event.target.files[0]; // file;
            this.titleAndDescriptionOfDictionary.filename = this.newDictionary.name;
            const reader = new FileReader();
            reader.readAsText(this.newDictionary);
            reader.onload = () => {
                let jsonResp = JSON.stringify(reader.result);
                try {
                    let rep = JSON.parse(jsonResp);
                    let newDic: DictionaryModel = JSON.parse(rep);
                    this.titleAndDescriptionOfDictionary.title = newDic.title;
                    this.titleAndDescriptionOfDictionary.description = newDic.description;
                    if (Object.keys(newDic).length !== 3) {
                        this.validationMessage.isValid = false;
                        this.validationMessage.message = 'Lefichier doit avoir seulement 3 cles: title,description,words';
                        this.openSnackBar(this.validationMessage.message, 'Dismiss');
                    }
                } catch (e) {
                    this.validationMessage.isValid = false;
                    this.validationMessage.message = 'le format du fichier doit etre json';
                    this.openSnackBar(this.validationMessage.message, 'Dismiss');
                }
                // eslint-disable-next-line no-empty
                if (this.isNewDictionaryHasSameTitleAsAnother()) {
                    this.validationMessage.isValid = false;
                    this.validationMessage.message = "le dictionnaire a le meme titre q'un autre dictionnaire, svp change le titre !!!";
                    this.openSnackBar(this.validationMessage.message, 'Dismiss');
                }
                this.validationMessage.isValid = true;
                this.validationMessage.message = 'Le format du fichier est conforme au format attendu';
            };
        }
    }

    isNewDictionaryHasSameTitleAsAnother(): boolean {
        // eslint-disable-next-line @typescript-eslint/no-inferrable-types
        let result: boolean = false;
        this.listDictionaries.forEach((dic): false | any => {
            if (dic.title.toLocaleLowerCase() === this.titleAndDescriptionOfDictionary.title.toLocaleLowerCase()) {
                result = true;
            }
        });
        return result;
    }

    async onSubmit() {
        const file = new FormData();
        file.set('file', this.newDictionary);
        await this.http
            .post('http://localhost:3000/api/admin/dictionary/addNewDictionary', file)
            .toPromise()
            .then(
                (resp: any) => {
                    this.fileMessage.isuploaded = resp.isuploaded;
                    this.fileMessage.message = resp.message;
                },
                (err) => {
                    console.log('erreur : ' + JSON.stringify(err));
                    this.openSnackBar('Probleme de televersement du fichier cote serveur', 'Dismiss');
                },
            );
        if (!this.fileMessage.isuploaded) {
            this.openSnackBar('Probleme de televersement du fichier cote serveur', 'Dismiss');
        } else {
            const statusUploading: FileMessages = await this.saveTitleAndDescription();
            if (statusUploading.isuploaded) {
                this.openSnackBar('Le dictionnaire a ete televerse avec success', 'Dismiss');
                this.interactionService.sendMessage('ok');
            } else {
                this.openSnackBar('Probleme de televersement du fichier cote serveur', 'Dismiss');
            }
        }
    }

    private async saveTitleAndDescription(): Promise<FileMessages> {
        await this.http
            .post('http://localhost:3000/api/admin/dictionary/addTitleAndDescription', this.titleAndDescriptionOfDictionary)
            .toPromise()
            .then((res: any) => {
                this.fileMessage.isuploaded = res.isuploaded;
                this.fileMessage.message = res.message;
            });
        return this.fileMessage;
    }

    resetForm() {
        console.log(this.myInputVariable.nativeElement.files);
        this.myInputVariable.nativeElement.value = '';
        console.log(this.myInputVariable.nativeElement.files);
    }

    openSnackBar(message: any, action: any) {
        let snackBarRef = this.snackBarService.open(message, action, { duration: 5000 });
        snackBarRef.afterDismissed().subscribe(() => {
            this.resetForm();
            console.log('---> the snackBar was dismissed');
        });
        snackBarRef.onAction().subscribe(() => {
            console.log('---> the snackBar action was triggered');
        });
    }
    onCancel() {
        this.interactionService.sendMessage('ok');
    }
}
