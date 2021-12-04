import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';
@Component({
    selector: 'app-game-mode-dialog',
    templateUrl: './game-mode-dialog.component.html',
    styleUrls: ['./game-mode-dialog.component.scss'],
})
export class GameModeDialogComponent {
    nameError: boolean;
    errorMessage: string;
    dictionaryError: boolean;
    isChecked: boolean;
    message: string;

    constructor(public userSettingsService: UserSettingsService, public matDialog: MatDialog, public soundManagerService: SoundManagerService) {
        this.errorMessage = '';
        this.dictionaryError = true;
        this.isChecked = false;
        this.message = '';
    }

    validateName() {
        const result = this.userSettingsService.validateName(this.userSettingsService.nameOption.userChoice);
        this.nameError = result.error;
        this.errorMessage = result.errorMessage;
    }
    applyRandomMode(event: MatCheckboxChange) {
        this.soundManagerService.playClickOnButtonAudio();
        this.userSettingsService.randomMode = event.checked;
        this.message = 'MODE BONUS ALEATOIRE ACTIVÉ';
        if (!event.checked) {
            this.message = 'MODE BONUS ALEATOIRE DESACTIVÉ';
        }
    }

    numPlayerChoice() {
        const numPlayers = this.userSettingsService.settings.numPlayers.currentChoiceKey;
        if (numPlayers === 'multiplayer') {
            return true;
        } else {
            return false;
        }
    }
    validateDictionary(error: boolean) {
        this.dictionaryError = error;
    }
}
