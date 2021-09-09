import { Component } from '@angular/core';

@Component({
    selector: 'app-game-mode-dialog',
    templateUrl: './game-mode-dialog.component.html',
    styleUrls: ['./game-mode-dialog.component.scss'],
})
export class GameModeDialogComponent {
    readonly choices = {
        solo: 'Jouer seul',
        multiplayer: 'Multijoueur',
    };
    // onClick(numPlayers: string) {/*console.log(numPlayers);*/}
}
