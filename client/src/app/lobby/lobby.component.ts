import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RoomService } from '@app/services/room.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { QuitMultiplayerDialogComponent } from './../components/quit-multiplayer-dialog/quit-multiplayer-dialog.component';
@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent {
    constructor(public matDialog: MatDialog, public userSettingsService: UserSettingsService, public roomService: RoomService) {}

    goInRoom(id?: string) {
        if (id) {
            this.roomService.roomId = id;
            this.roomService.joinRoom(id);
        } else {
            this.roomService.createRoom();
        }
    }

    openQuitMultiplayerDialog() {
        this.matDialog.open(QuitMultiplayerDialogComponent);
    }
}
