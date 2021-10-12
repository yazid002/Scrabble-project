import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserSettingsService } from '@app/services/user-settings.service';
@Component({
    selector: 'app-game-mode-dialog',
    templateUrl: './game-mode-dialog.component.html',
    styleUrls: ['./game-mode-dialog.component.scss'],
})
export class GameModeDialogComponent {
    error: boolean;
    errorMessage: string = '';

    constructor(public userSettingsService: UserSettingsService, public matDialog: MatDialog) {}

    validateName() {
        const result = this.userSettingsService.validateName(this.userSettingsService.nameOption.userChoice);
        this.error = result.error;
        this.errorMessage = result.errorMessage;
    }
    numPlayerChoice() {
        const numPlayers = this.userSettingsService.settings.numPlayers.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.numPlayers.currentChoiceKey,
        );
        if (numPlayers?.key === 'multiplayer') {
            return true;
        } else if (numPlayers?.key === 'solo') {
            return false;
        } else return undefined;
    }
    // openLobby(modeKey: string) {
    //     this.userSettingsService.settings.numPlayers.currentChoiceKey = modeKey;
    //     this.openDialog();
    // }

    // private openDialog() {
    //     this.matDialog.open(LobbyComponent);
    // }
}
