/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable prettier/prettier */
import { HttpClient } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { SERVER_URL } from '@app/constants/url';
import { DictionaryModel } from '@app/pages/admin-page/models/dictionary.model';
import { FileMessages } from '@app/pages/admin-page/models/file-messages.model';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';
import { ValidationMessageModel } from '@app/pages/admin-page/models/validation-message.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    @Output() snackBarSignal = new BehaviorSubject<{ message: string, action: string }>({ message:'',action: ''});

    listDictionaries: TitleDescriptionOfDictionary[] = [];
    titleAndDescriptionOfDictionary: TitleDescriptionOfDictionary = {
        filename: '',
        title: '',
        description: '',
    };
    validationMessage: ValidationMessageModel = {
        isValid: true,
        message: '',
    };
    fileMessage: FileMessages = {
        isuploaded: true,
        message: '',
    };
    url: string;
    constructor(private http: HttpClient) {
        this.url = SERVER_URL + '/api/admin/dictionary';
    }

    isNewDictionaryHasSameTitleAsAnother(): boolean {
        let result = false;
        this.listDictionaries.forEach((dic) => {
            if (dic.title.toLocaleLowerCase() === this.titleAndDescriptionOfDictionary.title.toLocaleLowerCase()) {
                result = true;
            }
        });
        return result;
    }
    public async getAllDictionaries(): Promise<TitleDescriptionOfDictionary[]> {
        await this.http
            .get<TitleDescriptionOfDictionary[]>(this.url + '/findAll')
            .toPromise()
            .then((res) => {
                this.listDictionaries = res;
            });
        return this.listDictionaries;
    }
    async deleteDictionary(filename: string) {
        this.http.delete<string>(this.url + '/delete/' + filename).subscribe(async (rep) => {
            // TODO a implementer
            console.log(rep);
            this.getAllDictionaries();
        });
    }
    async selectDictionary(file: File) {
        this.titleAndDescriptionOfDictionary.filename = file.name;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const jsonResp = JSON.stringify(reader.result);
            try {
                const rep = JSON.parse(jsonResp);
                const newDic: DictionaryModel = JSON.parse(rep);
                this.titleAndDescriptionOfDictionary.title = newDic.title;
                this.titleAndDescriptionOfDictionary.description = newDic.description;
                if (Object.keys(newDic).length !== 3) {
                    this.validationMessage.isValid = false;
                    this.validationMessage.message = 'Lefichier doit avoir seulement 3 cles: title,description,words';
                    this.emitToSnackBar(this.validationMessage.message, 'Dismiss');
                }
            } catch (e) {
                this.validationMessage.isValid = false;
                this.validationMessage.message = 'le format du fichier doit etre json';
                this.emitToSnackBar(this.validationMessage.message, 'Dismiss');
            }
            if (this.isNewDictionaryHasSameTitleAsAnother()) {
                this.validationMessage.isValid = false;
                this.validationMessage.message = "le dictionnaire a le meme titre q'un autre dictionnaire, svp change le titre !!!";
                this.emitToSnackBar(this.validationMessage.message, 'Dismiss');
            }
            this.validationMessage.isValid = true;
            this.validationMessage.message = 'Le format du fichier est conforme au format attendu';
        };
        this.upload(file);
    }
    async upload(file: File) {
        const fileForm = new FormData();
        fileForm.set('file', file);
        await this.http
            .post(SERVER_URL + '/api/admin/dictionary/addNewDictionary', fileForm)
            .toPromise()
            .then(
                (resp: any) => {
                    this.fileMessage.isuploaded = resp.isuploaded;
                    this.fileMessage.message = resp.message;
                },
                (err) => {
                    console.log('erreur : ' + JSON.stringify(err));
                    this.emitToSnackBar('Probleme de televersement du fichier cote serveur', 'Dismiss');
                },
            );
        if (!this.fileMessage.isuploaded) {
            this.emitToSnackBar('Probleme de televersement du fichier cote serveur', 'Dismiss');
        } else {
            const statusUploading: FileMessages = await this.saveTitleAndDescription();
            if (statusUploading.isuploaded) {
                this.emitToSnackBar('Le dictionnaire a ete televerse avec success', 'Dismiss');
                await this.getAllDictionaries();
            } else {
                this.emitToSnackBar('Probleme de televersement du fichier cote serveur', 'Dismiss');
            }
        }
    }

    async saveTitleAndDescription(): Promise<FileMessages> {
        await this.http
            .post(SERVER_URL + '/api/admin/dictionary/addTitleAndDescription', this.titleAndDescriptionOfDictionary)
            .toPromise()
            .then((res: any) => {
                this.fileMessage.isuploaded = res.isuploaded;
                this.fileMessage.message = res.message;
            });
        return this.fileMessage;
    }
    private emitToSnackBar(message: string, action: string) {
        this.snackBarSignal.next({message,action})
    }
}
