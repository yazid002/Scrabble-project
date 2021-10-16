import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IOption } from '@app/classes/game-options';
import { GameModeDialogComponent } from '@app/components/game-mode-dialog/game-mode-dialog.component';
import { UserSettingsService } from '@app/services/user-settings.service';
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
    listGames: Game[] = [
        { name: 'Game1', index: 1, turnDuration: '1 minute', isAvailable: true },
        { name: 'Game2', index: 2, turnDuration: '1.5minute', isAvailable: true },
        { name: 'Game3', index: 3, turnDuration: '2 minutes', isAvailable: true },
    ];

    // headers: string[] = ['Game', 'turnDuration', 'Number of players'];
    constructor(public matDialog: MatDialog, public userSettingsService: UserSettingsService) {}
    ngOnInit(): void {
        const name = this.userSettingsService.nameOption.userChoice;
        const mode = this.userSettingsService.settings.mode.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.mode.currentChoiceKey,
        );
        const numPlayers = this.userSettingsService.settings.numPlayers.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.numPlayers.currentChoiceKey,
        );
        const timer = this.userSettingsService.settings.timer.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.timer.currentChoiceKey,
        );
        this.assignValues(name, mode, numPlayers, timer);
    }
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    // ngOnInit(): void {}
    openDialog() {
        this.matDialog.open(GameModeDialogComponent);
    }

    openSwitchDialog() {
        this.matDialog.open(SwitchDialogComponent);
    }

    private assignValues(name: string, mode: IOption | undefined, numPlayers: IOption | undefined, timer: IOption | undefined) {
        if (name && mode && numPlayers && timer) {
            this.name = name;
            this.mode = mode.value;
            this.numPlayers = numPlayers.value;
            this.timer = timer.value;
        }
    }
}
