import { Component } from '@angular/core';
import { RoomService } from '@app/services/room.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
@Component({
    selector: 'app-quit-multiplayer-dialog',
    templateUrl: './quit-multiplayer-dialog.component.html',
    styleUrls: ['./quit-multiplayer-dialog.component.scss'],
})
export class QuitMultiplayerDialogComponent {
    constructor(private roomService: RoomService, public soundManagerService: SoundManagerService) {}

    quitRoom() {
        this.roomService.quitRoom();
    }

    playClickOnButtonAudio() {
        this.soundManagerService.playClickOnButtonAudio();
    }
}
