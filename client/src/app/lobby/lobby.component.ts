import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IOption } from '@app/classes/game-options';
import { Room } from '@app/services/room.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { QuitMultiplayerDialogComponent } from './../components/quit-multiplayer-dialog/quit-multiplayer-dialog.component';
import { SwitchDialogComponent } from './../components/switch-dialog/switch-dialog.component';
export interface Game {
    name: string;
    index: number;
    turnDuration: string;
    isAvailable: boolean;
}
@Component({
    selector: 'app-lobby',
    templateUrl: './lobby.component.html',
    styleUrls: ['./lobby.component.scss'],
})
export class LobbyComponent implements OnInit {
    name: string;
    numPlayers: string;
    mode: string;
    timer: string;
    personIsActive: boolean = false;

    rooms: Room[] = [
        { id: 'Game 1', settings: { mode: 'classique', timer: '1 minute' } },
        { id: 'Game 2', settings: { mode: 'classique', timer: '1 minute' } },
        { id: 'Game 3', settings: { mode: 'classique', timer: '1 minute' } },
    ];
    // headers: string[] = ['Game', 'turnDuration', 'Number of players'];
    constructor(public matDialog: MatDialog, public userSettingsService: UserSettingsService) {}
    ngOnInit(): void {
        const name = this.userSettingsService.nameOption.userChoice;
        if (!localStorage.getItem('test')) localStorage.setItem('test', name);
        const mode = this.userSettingsService.settings.mode.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.mode.currentChoiceKey,
        );
        // if (!localStorage.getItem('localMode')) localStorage.setItem('localMode', JSON.stringify(mode?.value));
        const numPlayers = this.userSettingsService.settings.numPlayers.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.numPlayers.currentChoiceKey,
        );
        const timer = this.userSettingsService.settings.timer.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.timer.currentChoiceKey,
        );
        this.assignValues(name, mode, numPlayers, timer);
    }

    openQuitMultiplayerDialog() {
        this.matDialog.open(QuitMultiplayerDialogComponent);
    }

    openSwitchDialog() {
        this.matDialog.open(SwitchDialogComponent);
    }

    private assignValues(name: string, mode: IOption | undefined, numPlayers: IOption | undefined, timer: IOption | undefined) {
        if (name && mode && numPlayers && timer) {
            this.name = localStorage.getItem('test') as string;
            this.mode = mode.value;
            this.numPlayers = numPlayers.value;
            this.timer = timer.value;
        }
    }
}
