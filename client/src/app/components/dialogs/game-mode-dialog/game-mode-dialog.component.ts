import { Component } from '@angular/core';
import * as GAME_SETTINGS from '@app/classes/game-options';

@Component({
    selector: 'app-game-mode-dialog',
    templateUrl: './game-mode-dialog.component.html',
    styleUrls: ['./game-mode-dialog.component.scss'],
})
export class GameModeDialogComponent {
    readonly settings = GAME_SETTINGS.SETTINGS;
    readonly nameOption = GAME_SETTINGS.NAME_OPTION;
    
}
