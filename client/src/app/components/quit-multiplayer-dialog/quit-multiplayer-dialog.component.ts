import { Component } from '@angular/core';
import { RoomService } from '@app/services/room.service';

@Component({
    selector: 'app-quit-multiplayer-dialog',
    templateUrl: './quit-multiplayer-dialog.component.html',
    styleUrls: ['./quit-multiplayer-dialog.component.scss'],
})
export class QuitMultiplayerDialogComponent {
    constructor(public roomService: RoomService) {}
}
