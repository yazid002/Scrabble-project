import { Component } from '@angular/core';
import * as GAME_SETTINGS from '@app/classes/game-options';
import { UserSettingsService } from '@app/services/user-settings.service';

@Component({
    selector: 'app-game-mode-dialog',
    templateUrl: './game-mode-dialog.component.html',
    styleUrls: ['./game-mode-dialog.component.scss'],
})
export class GameModeDialogComponent {
    readonly nameOption = GAME_SETTINGS.NAME_OPTION;
    settings: {
        modes: GAME_SETTINGS.IOptionList;
        numPlayers: GAME_SETTINGS.IOptionList;
        computerLevel: GAME_SETTINGS.IOptionList;
    };
    error: boolean;
    errorMessage: string = '';

    constructor(public userSettingsService: UserSettingsService) {}

    validateName() {
        const result = this.userSettingsService.validateName(this.nameOption.userChoice);
        this.error = result.error;
        this.errorMessage = result.errorMessage;
    }
}
