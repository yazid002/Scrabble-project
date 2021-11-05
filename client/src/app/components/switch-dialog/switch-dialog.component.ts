import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserSettingsService } from '@app/services/user-settings.service';
@Component({
    selector: 'app-switch-dialog',
    templateUrl: './switch-dialog.component.html',
    styleUrls: ['./switch-dialog.component.scss'],
})
export class SwitchDialogComponent {
    constructor(public userSettingsService: UserSettingsService, public matDialog: MatDialog) {}
}
