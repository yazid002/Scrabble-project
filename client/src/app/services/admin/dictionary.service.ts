import { HttpClient } from '@angular/common/http';
import { Injectable, Output } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { SERVER_URL } from '@app/constants/url';
import { FileMessages } from '@app/pages/admin-page/models/file-messages.model';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/title-description-of-dictionary.model';
import { ValidationMessageModel } from '@app/pages/admin-page/models/validation-message.model';
import { saveAs } from 'file-saver';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    @Output() snackBarSignal: BehaviorSubject<{ message: string; action: string }>;
    listDictionaries: TitleDescriptionOfDictionary[];
    titleAndDescriptionOfDictionary: TitleDescriptionOfDictionary;
    validationMessage: ValidationMessageModel;
    fileMessage: FileMessages;
    url: string;
    constructor(private http: HttpClient) {
        this.snackBarSignal = new BehaviorSubject<{ message: string; action: string }>({ message: '', action: '' });
        this.listDictionaries = [];
        this.titleAndDescriptionOfDictionary = {
            title: '',
            description: '',
        };
        this.fileMessage = {
            isUploaded: true,
            message: '',
        };

        this.validationMessage = {
            isValid: true,
            message: '',
        };
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
        const value = await this.http
            .get<TitleDescriptionOfDictionary[]>(this.url + '/findAll')
            .toPromise()
            .then((res) => this.assignDictionary(res));
        return value;
    }
    assignDictionary(dic: TitleDescriptionOfDictionary[]) {
        this.listDictionaries = dic;
        return this.listDictionaries;
    }
    async deleteDictionary(name: string): Promise<void> {
        this.http.delete<string>(this.url + '/delete/' + name).subscribe(async () => {
            this.getAllDictionaries();
        });
    }
    async selectDictionary(file: File): Promise<void> {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            try {
                const newDic: Dictionary = JSON.parse(reader.result as string) as unknown as Dictionary;
                this.titleAndDescriptionOfDictionary.title = newDic.title;
                this.titleAndDescriptionOfDictionary.description = newDic.description;
                if (!this.isNewDictionaryHasSameTitleAsAnother()) {
                    this.upload(file);
                    this.validationMessage.isValid = true;
                    this.validationMessage.message = 'Le format du fichier est conforme au format attendu';
                }
            } catch (e) {
                this.validationMessage.isValid = false;
                this.validationMessage.message = 'le format du fichier doit etre json contenant un objet de type dictionaire.';
            }
            this.emitToSnackBar(this.validationMessage.message, 'Fermer');
        };
    }
    async upload(file: File): Promise<void> {
        const fileForm = new FormData();
        fileForm.set('file', file);
        await this.http.post<FileMessages>(this.url + '/addNewDictionary', fileForm).subscribe(
            (resp: FileMessages) => {
                this.fileMessage.isUploaded = resp.isUploaded;
                this.fileMessage.message = resp.message;
                this.emitToSnackBar('Le dictionnaire a ete televerse avec success', 'Fermer');
                this.getAllDictionaries();
            },
            (err: Error) => {
                this.emitToSnackBar('Probleme de televersement du fichier cote serveur' + JSON.stringify(err), 'Fermer');
            },
        );
    }
    fetchDictionary(name: string): Observable<Dictionary> {
        const dictObs = this.http.get<Dictionary>(this.url + '/getDictionary/' + name);
        return dictObs;
    }
    reset() {
        this.http.get<void>(this.url + '/reset').subscribe(async () => {
            this.emitToSnackBar('Les dictionaires ont été reset avec succès', 'Fermer');
            await this.getAllDictionaries();
        });
    }
    download(name: string) {
        return this.fetchDictionary(name).subscribe((dict: Dictionary) => {
            return this.writeDict(dict);
        });
    }
    writeDict(dict: Dictionary): string {
        const file = new Blob([JSON.stringify(dict)], { type: 'text/json;charset=utf-8' });
        saveAs(file, dict.title + '.json');
        return 'success';
    }

    private emitToSnackBar(message: string, action: string): void {
        this.snackBarSignal.next({ message, action });
    }
}
