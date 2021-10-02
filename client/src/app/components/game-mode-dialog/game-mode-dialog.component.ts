import { Component } from '@angular/core';
import { UserSettingsService } from '@app/services/user-settings.service';

@Component({
    selector: 'app-game-mode-dialog',
    templateUrl: './game-mode-dialog.component.html',
    styleUrls: ['./game-mode-dialog.component.scss'],
})
export class GameModeDialogComponent {
    error: boolean;
    errorMessage: string = '';

    constructor(public userSettingsService: UserSettingsService) {}

    validateName() {
        const result = this.userSettingsService.validateName(this.userSettingsService.nameOption.userChoice);
        this.error = result.error;
        this.errorMessage = result.errorMessage;
    }
}
