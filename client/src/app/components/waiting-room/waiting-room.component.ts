import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IOption } from '@app/classes/game-options';
import { RoomService } from '@app/services/room.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { QuitMultiplayerDialogComponent } from './../quit-multiplayer-dialog/quit-multiplayer-dialog.component';
import { SwitchDialogComponent } from './../switch-dialog/switch-dialog.component';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent implements OnInit {
    name: string;
    mode: string;
    timer: string;
    constructor(public userSettingsService: UserSettingsService, public matDialog: MatDialog, public roomService: RoomService) {}
    ngOnInit(): void {
        const name = this.userSettingsService.nameOption.userChoice;
        if (!localStorage.getItem('test')) localStorage.setItem('test', name);
        const mode = this.userSettingsService.settings.mode.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.mode.currentChoiceKey,
        );
        // if (!localStorage.getItem('localMode')) localStorage.setItem('localMode', JSON.stringify(mode?.value));
        const timer = this.userSettingsService.settings.timer.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.timer.currentChoiceKey,
        );
        this.assignValues(name, mode, timer);
        this.roomService.createRoom();
    }
    openSwitchToSoloDialog() {
        this.matDialog.open(SwitchDialogComponent);
    }
    openQuitMultiplayerDialog() {
        this.matDialog.open(QuitMultiplayerDialogComponent);
    }
    private assignValues(name: string | undefined, mode: IOption | undefined, timer: IOption | undefined) {
        if (name && mode && timer) {
            // this.name = localStorage.getItem('test') as string;
            this.name = name;
            this.mode = mode.value;
            this.timer = timer.value;
        }
    }
}
