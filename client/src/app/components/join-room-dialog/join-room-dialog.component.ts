import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';

@Component({
    selector: 'app-join-room-dialog',
    templateUrl: './join-room-dialog.component.html',
    styleUrls: ['./join-room-dialog.component.scss'],
})
export class JoinRoomDialogComponent {
    error: boolean;
    errorMessage: string;
    isChecked: boolean;
    message: string;

    constructor(public userSettingsService: UserSettingsService, public matDialog: MatDialog, public soundManagerService: SoundManagerService) {
        this.errorMessage = '';
        this.isChecked = false;
        this.message = '';
    }

    validateName() {
        const result = this.userSettingsService.validateName(this.userSettingsService.nameOption.userChoice);
        this.error = result.error;
        this.errorMessage = result.errorMessage;
    }
}
