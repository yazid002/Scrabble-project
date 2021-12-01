import { HttpClient } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { SERVER_URL } from '@app/constants/url';
import { FileMessages } from '@app/pages/admin-page/models/file-messages.model';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';
import { ValidationMessageModel } from '@app/pages/admin-page/models/validation-message.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    @Output() snackBarSignal = new BehaviorSubject<{ message: string; action: string }>({ message: '', action: '' });

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
        this.validationMessage.isValid = false;
        this.validationMessage.message = "le dictionnaire a le meme titre q'un autre dictionnaire, svp change le titre !!!";
        return result;
    }
    async getAllDictionaries(): Promise<TitleDescriptionOfDictionary[]> {
        await this.http
            .get<TitleDescriptionOfDictionary[]>(this.url + '/findAll')
            .toPromise()
            .then((res) => {
                this.listDictionaries = res;
            });
        return this.listDictionaries;
    }
    async deleteDictionary(name: string) {
        this.http.delete<string>(this.url + '/delete/' + name).subscribe(async () => {

            this.getAllDictionaries();
        });
    }
    async selectDictionary(file: File) {
        this.titleAndDescriptionOfDictionary.filename = file.name;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            try {
                const newDic: Dictionary = JSON.parse(reader.result as string) as unknown as Dictionary;
                console.log('new dict type', typeof newDic);
                this.titleAndDescriptionOfDictionary.title = newDic.title;
                this.titleAndDescriptionOfDictionary.description = newDic.description;
                console.log('words type', typeof newDic.words);
                if (!this.isNewDictionaryHasSameTitleAsAnother()) {
                    this.upload(file);
                    this.validationMessage.isValid = true;
                    this.validationMessage.message = 'Le format du fichier est conforme au format attendu';
                }
            } catch (e) {
                this.validationMessage.isValid = false;
                this.validationMessage.message = 'le format du fichier doit etre json contenant un objet de type dictionaire.';
            }
            this.emitToSnackBar(this.validationMessage.message, 'Dismiss');
        };
    }
    async upload(file: File) {
        const fileForm = new FormData();
        fileForm.set('file', file);
        await this.http.post<FileMessages>(SERVER_URL + '/api/admin/dictionary/addNewDictionary', fileForm).subscribe(
            (resp: FileMessages) => {
                this.fileMessage.isuploaded = resp.isuploaded;
                this.fileMessage.message = resp.message;
                this.getAllDictionaries();
            },
            (err) => {
                console.log('erreur : ' + JSON.stringify(err));
                this.emitToSnackBar('Probleme de televersement du fichier cote serveur', 'Dismiss');
            },
        );
        if (!this.fileMessage.isuploaded) {
            this.emitToSnackBar('Probleme de televersement du fichier cote serveur', 'Dismiss');
        } else {
            this.emitToSnackBar('Le dictionnaire a ete televerse avec success', 'Dismiss');
        }
    }

    private emitToSnackBar(message: string, action: string) {
        this.snackBarSignal.next({ message, action });
    }
}
