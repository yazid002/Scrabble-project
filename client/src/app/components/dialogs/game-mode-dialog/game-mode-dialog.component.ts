import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-game-mode-dialog',
    templateUrl: './game-mode-dialog.component.html',
    styleUrls: ['./game-mode-dialog.component.scss'],
})
export class GameModeDialogComponent implements OnInit {
    readonly choices = {
        solo: 'Jouer seul',
        multiplayer: 'Multijoueur',
    };
    ngOnInit(): void {
        // do nothing
    }
    // onClick(numPlayers: string) {/*console.log(numPlayers);*/}
}
