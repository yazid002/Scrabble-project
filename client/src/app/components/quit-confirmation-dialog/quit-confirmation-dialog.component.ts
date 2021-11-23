import { Component } from '@angular/core';
import { GameService } from '@app/services/game.service';
import { SoundManagerService } from '@app/services/sound-manager.service';

@Component({
    selector: 'app-quit-confirmation-dialog',
    templateUrl: './quit-confirmation-dialog.component.html',
    styleUrls: ['./quit-confirmation-dialog.component.scss'],
})
export class QuitConfirmationDialogComponent {
    constructor(private gameService: GameService, private soundManagerService: SoundManagerService) {}

    quitGame() {
        this.gameService.quitGame();
        this.soundManagerService.playQuitGameAudio();
    }
}
