import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PLAYER } from '@app/classes/player';
import { GameService } from '@app/services/game.service';
import { GoalsManagerService } from '@app/services/goals-manager.service';
import { RoomService } from '@app/services/room.service';
import { UserSettingsService } from '@app/services/user-settings.service';
@Component({
    selector: 'app-switch-dialog',
    templateUrl: './switch-dialog.component.html',
    styleUrls: ['./switch-dialog.component.scss'],
})
export class SwitchDialogComponent {
    constructor(
        public gameService: GameService,
        public roomService: RoomService,
        public userSettingsService: UserSettingsService,
        public matDialog: MatDialog,
        private goalsManagerService: GoalsManagerService,
    ) {}
    // quitRoom() {
    //     this.roomService.quitRoom();
    // }
    configureGame() {
        this.gameService.players[PLAYER.realPlayer].name = this.userSettingsService.nameOption.userChoice;
        this.gameService.numPlayers = 'solo';
        this.goalsManagerService.isEnabled = this.userSettingsService.switchToSoloSettings.mode.currentChoiceKey === 'log2990';
    }
}
