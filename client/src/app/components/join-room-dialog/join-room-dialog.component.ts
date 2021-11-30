import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PLAYER } from '@app/classes/player';
import { GameService } from '@app/services/game.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { GoalsManagerService } from './../../services/goals-manager.service';

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
        public matDialog: MatDialog,
        public soundManagerService: SoundManagerService,
        public goalsManagerService: GoalsManagerService,
        public gameService: GameService,
    ) {}

    validateName() {
        const result = this.userSettingsService.validateName(this.userSettingsService.nameOption.userChoice);
        this.error = result.error;
        this.errorMessage = result.errorMessage;
    }

    playClickOnButtonAudio() {
        this.gameService.players[PLAYER.realPlayer].name = this.userSettingsService.nameOption.userChoice;
        this.userSettingsService.settings.mode.currentChoiceKey = 'log2990';
        this.goalsManagerService.isEnabled = this.userSettingsService.settings.mode.currentChoiceKey === 'log2990';
        this.soundManagerService.playClickOnButtonAudio();
    }
}
