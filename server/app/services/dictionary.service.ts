/* eslint-disable no-undef */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable import/namespace */
/* eslint-disable import/no-deprecated */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { Dictionary } from '@app/models/dictionary.model';
import { TitleDescriptionOfDictionary } from '@app/models/titleDescriptionOfDictionary.model';
import { Service } from 'typedi';

@Service()
export class DictionaryService {
    availableDictionaries: TitleDescriptionOfDictionary[] = [{ title: 'Mon dictionnaire', description: 'Description de base' }];

    findAllDictionaries(): TitleDescriptionOfDictionary[] {
        return this.availableDictionaries;
    }

    addDictionary(newDictionary: Dictionary) {
        try {
            const newTitleDescriptionDic = new TitleDescriptionOfDictionary();
            newTitleDescriptionDic.title = newDictionary.title;
            newTitleDescriptionDic.description = newDictionary.description;
            this.availableDictionaries.push(newTitleDescriptionDic);
            // add also dictionary file
            return 'Le dictionnaire a ete ajoute avec success';
        } catch (error) {
            return "Echec d'ajout du dictionnaire";
        }
    }

    removeDictionary(titleValue: string) {
        this.availableDictionaries = this.availableDictionaries.filter((dict) => dict.title.toLowerCase() !== titleValue.toLowerCase());
    }
    // remove also dictionary file
}
