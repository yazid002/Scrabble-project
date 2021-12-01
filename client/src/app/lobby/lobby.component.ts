import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IOption } from '@app/classes/game-options';
import { RoomService } from '@app/services/room.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { QuitMultiplayerDialogComponent } from './../components/quit-multiplayer-dialog/quit-multiplayer-dialog.component';
@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss', './lobby.component-button.scss'],
})
export class LobbyComponent implements OnInit {
    name: string;
    mode: IOption;

    constructor(
        public matDialog: MatDialog,
        public userSettingsService: UserSettingsService,
        public roomService: RoomService,
        public soundManagerService: SoundManagerService,
    ) {}
    ngOnInit(): void {
        const name = this.userSettingsService.nameOption.userChoice;
        const mode = this.userSettingsService.settings.mode.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.mode.currentChoiceKey,
        );
        this.assignValues(name, mode);
    }

    assignValues(name: string | undefined, mode: IOption | undefined) {
        if (name && mode) {
            this.name = name;
            this.mode = mode;
        }
    }
    goInRoom(id?: string, index?: number) {
        if (id && index !== undefined) {
            this.roomService.roomId = id;
            this.roomService.joinRoom(id);
            this.userSettingsService.settings.timer.currentChoiceKey = this.roomService.rooms[index].settings.timer;
        } else {
            this.roomService.createRoom();
        }
    }

    openQuitMultiplayerDialog() {
        this.matDialog.open(QuitMultiplayerDialogComponent);
    }

    playClickOnButtonAudio() {
        this.soundManagerService.playClickOnButtonAudio();
    }

    get numbers(): number {
        return this.roomService.rooms.length;
    }
}
