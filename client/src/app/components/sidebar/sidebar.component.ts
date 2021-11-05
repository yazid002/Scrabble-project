import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuitConfirmationDialogComponent } from '@app/components/quit-confirmation-dialog/quit-confirmation-dialog.component';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    constructor(public matDialog: MatDialog) {}
    openQuitConfirmationDialog() {
        this.matDialog.open(QuitConfirmationDialogComponent);
    }
}
