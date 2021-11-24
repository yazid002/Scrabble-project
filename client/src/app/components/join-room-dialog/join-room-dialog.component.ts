import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameService } from '@app/services/game.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { PLAYER } from '@app/classes/player';
import { GoalsManagerService } from '@app/services/goals-manager.service';
@Component({
    selector: 'app-join-room-dialog',
    templateUrl: './join-room-dialog.component.html',
    styleUrls: ['./join-room-dialog.component.scss'],
})
export class JoinRoomDialogComponent {
    error: boolean;
    errorMessage: string = '';
    isChecked: boolean = false;
    message: string = '';
    constructor(
        public userSettingsService: UserSettingsService,
        public gameService: GameService,
        public matDialog: MatDialog,
        public soundManagerService: SoundManagerService,
        public goalsManagerService: GoalsManagerService,
    ) {}

    validateName() {
        const result = this.userSettingsService.validateName(this.userSettingsService.nameOption.userChoice);
        this.error = result.error;
        this.errorMessage = result.errorMessage;
    }

    configureGame() {
        this.gameService.players[PLAYER.realPlayer].name = this.userSettingsService.nameOption.userChoice;
        this.gameService.numPlayers = this.userSettingsService.settings.numPlayers.currentChoiceKey;
        this.goalsManagerService.isEnabled = this.userSettingsService.settings.mode.currentChoiceKey === 'log2990';
        this.playClickOnButtonAudio();
    }

    playClickOnButtonAudio() {
        this.soundManagerService.playClickOnButtonAudio();
    }
}
