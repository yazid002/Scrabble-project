import { Dictionary } from './../../classes/dictionary';
// import { GameModeDialogComponent } from './../game-mode-dialog/game-mode-dialog.component';
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
    dict: Dictionary;
    constructor(
        public userSettingsService: UserSettingsService,
        public matDialog: MatDialog,
        public roomService: RoomService, // public gameModeDialogComponent: GameModeDialogComponent,
    ) {}
    ngOnInit(): void {
        const name = this.userSettingsService.nameOption.userChoice;
        const mode = this.userSettingsService.settings.mode.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.mode.currentChoiceKey,
        );
        const timer = this.userSettingsService.settings.timer.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.timer.currentChoiceKey,
        );
        const dict = this.userSettingsService.selectedDictionary;
        // const dictionnaire = this.gameModeDialogComponent.selectedDictionary;
        this.assignValues(name, mode, timer, dict);
        this.roomService.createRoom();
    }
    openSwitchToSoloDialog() {
        this.matDialog.open(SwitchDialogComponent);
    }
    openQuitMultiplayerDialog() {
        this.matDialog.open(QuitMultiplayerDialogComponent);
    }

    private assignValues(name: string | undefined, mode: IOption | undefined, timer: IOption | undefined, dict: Dictionary | undefined) {
        if (name && mode && timer && dict) {
            this.name = name;
            this.mode = mode.value;
            this.timer = timer.value;
            this.dict = dict;
        }
    }
    get numbers(): number {
        // console.log('length = ' + this.roomService.rooms.length);
        return this.roomService.rooms.length;
    }

    get selected(): Dictionary {
        console.log('selected dictionnary = ' + this.userSettingsService.selectedDictionary);
        console.log('selected dictionnary = ' + this.dict);
        return this.dict;
    }
}
