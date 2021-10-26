import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { GridService } from '@app/services/grid.service';
import { UserSettingsService } from '@app/services/user-settings.service';

@Component({
    selector: 'app-game-mode-dialog',
    templateUrl: './game-mode-dialog.component.html',
    styleUrls: ['./game-mode-dialog.component.scss'],
})
export class GameModeDialogComponent {
    error: boolean;
    errorMessage: string = '';
    isChecked: boolean = false;
    message: string = '';

    constructor(public userSettingsService: UserSettingsService, private gridService: GridService) {}

    validateName() {
        const result = this.userSettingsService.validateName(this.userSettingsService.nameOption.userChoice);
        this.error = result.error;
        this.errorMessage = result.errorMessage;
    }

    applyRandomMode(event: MatCheckboxChange) {
        this.gridService.isChecked = event.checked;
        this.message = 'MODE BONUS ALEATOIRE ACTIVÉ ';
        if (!event.checked) {
            this.message = 'MODE BONUS ALEATOIRE DESACTIVÉ';
        }
    }
}
