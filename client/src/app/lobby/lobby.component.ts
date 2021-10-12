import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
export class LobbyComponent {
    numPlayers: string;
    mode: string;
    computerLevel: string;
    timer: string;
    listGames: Game[] = [
        { name: 'Game1', index: 1, turnDuration: '1 minute', isAvailable: true },
        { name: 'Game2', index: 2, turnDuration: '1.5minute', isAvailable: true },
        { name: 'Game3', index: 3, turnDuration: '2 minutes', isAvailable: true },
    ];

    // headers: string[] = ['Game', 'turnDuration', 'Number of players'];
    constructor(public matDialog: MatDialog, public userSettingsService: UserSettingsService) {}

    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    // ngOnInit(): void {}
    openDialog() {
        this.matDialog.open(GameModeDialogComponent);
    }

    openSwitchDialog() {
        this.matDialog.open(SwitchDialogComponent);
    }
}
