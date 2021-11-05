import { Component } from '@angular/core';
import { GameService } from '@app/services/game.service';

@Component({
    selector: 'app-quit-confirmation-dialog',
    templateUrl: './quit-confirmation-dialog.component.html',
    styleUrls: ['./quit-confirmation-dialog.component.scss'],
})
export class QuitConfirmationDialogComponent {
    constructor(private gameService: GameService,) {}

    quitGame() {
        this.gameService.quitGame();
        // this.gamesync.receiveResetConfig();
        localStorage.clear();
    }
}
