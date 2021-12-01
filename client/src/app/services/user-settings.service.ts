import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IOptionList, IUserSetting, NAME_OPTION } from '@app/classes/game-options';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/titleDescriptionOfDictionary.model';
import { DictionaryService } from './admin/dictionary.service';

const MODE: IOptionList = {
    settingName: 'Mode de jeux',
    availableChoices: [
        { key: 'classic', value: 'Classique' },
        { key: 'log2990', value: 'LOG2990' },
    ],
};
const NUM_PLAYERS: IOptionList = {
    settingName: 'Nombre de joueurs',
    availableChoices: [
        { key: 'solo', value: 'Solo' },
        { key: 'multiplayer', value: 'Multijoueurs', disabled: false },
    ],
};
// const NUM_PLAYERS_SWITCH: IOptionList = {
//     settingName: 'Nombre de joueurs',
//     availableChoices: [{ key: 'solo', value: 'Solo' }],
// };

const COMPUTER_LEVEL: IOptionList = {
    settingName: "Niveau de l'ordinateur",
    availableChoices: [
        { key: 'beginner', value: 'Débutant' },
        { key: 'advanced', value: 'Avancé' },
    ],
};
const COMPUTER_NAMES: string[] = ['Ordi Illetré', 'Dictionnaire en Personne', 'Word Master'];
const TIMER: IOptionList = {
    settingName: 'Temps maximal par tour',
    availableChoices: [
        { key: '30', value: '30s' },
        { key: '60', value: '1m' },
        { key: '90', value: '1m30s' },
        { key: '120', value: '2m' },
        { key: '150', value: '2m30s' },
        { key: '180', value: '3m' },
        { key: '210', value: '3m30' },
        { key: '240', value: '4m' },
        { key: '270', value: '4m30' },
        { key: '300', value: '5m' },
    ],
};
@Injectable({
    providedIn: 'root',
})
export class UserSettingsService {
    settings: {
        mode: IUserSetting;
        numPlayers: IUserSetting;
        computerLevel: IUserSetting;
        timer: IUserSetting;
    } = {
        mode: { setting: MODE, currentChoiceKey: 'classic' },
        numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
        computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
        timer: { setting: TIMER, currentChoiceKey: '60' },
    };
    randomMode = false;
    dictionaryControl = new FormControl('', Validators.required);
    dictionnaires: TitleDescriptionOfDictionary[] = [];
    selectedDictionary: TitleDescriptionOfDictionary = { title: 'Mon dictionnaire', description: 'Le dictionaire par défault' };

    nameOption = NAME_OPTION;
    computerName: string;
    constructor(public dictionaryService: DictionaryService) {
        this.dictionaryService.getAllDictionaries().then((dict) => (this.dictionnaires = dict));
    }
    validateName(name: string): { error: boolean; errorMessage: string } {
        let error = false;
        let errorMessage = '';
        for (const pattern of NAME_OPTION.allowedPattern) {
            if (!pattern.rule.test(name)) {
                error = true;
                errorMessage = pattern.errorMessage;

                return { error, errorMessage };
            }
        }
        return { error, errorMessage };
    }
    getComputerName(): string {
        while (!this.computerName || this.computerName === this.nameOption.userChoice) {
            const nameIndex = Math.floor(Math.random() * Math.floor(COMPUTER_NAMES.length));
            this.computerName = COMPUTER_NAMES[nameIndex];
        }
        return this.computerName;
    }
    getSettings(): { mode: string; timer: string } {
        const mode = this.settings.mode.currentChoiceKey;
        const timer = this.settings.timer.currentChoiceKey;
        return { mode, timer };
    }

    changeDic() {
        console.log(this.selectedDictionary);
    }
}
