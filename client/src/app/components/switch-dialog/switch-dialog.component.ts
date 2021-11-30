import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoomService } from '@app/services/room.service';
import { UserSettingsService } from '@app/services/user-settings.service';
@Component({
    selector: 'app-switch-dialog',
    templateUrl: './switch-dialog.component.html',
    styleUrls: ['./switch-dialog.component.scss'],
})
export class SwitchDialogComponent {
    constructor(public roomService: RoomService, public userSettingsService: UserSettingsService, public matDialog: MatDialog) {}
    assignSolo() {
        this.userSettingsService.settings.numPlayers.currentChoiceKey = 'solo';
        console.log(this.userSettingsService.settings.numPlayers.currentChoiceKey);
    }
    // quitRoom() {
    //     this.roomService.quitRoom();
    // }
}
