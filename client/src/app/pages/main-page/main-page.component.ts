import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameModeDialogComponent } from '@app/components/dialogs/game-mode-dialog/game-mode-dialog.component';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly userChoices = {
        classic: 'Mode Classique',
        log2990: 'Mode LOG2990',
    };

    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor(public dialog: MatDialog) {}

    openDialog(mode: string) {
        mode.replace('c', 'c');
        if (mode === this.userChoices.classic) {
            this.dialog.open(GameModeDialogComponent);
        } else if (mode === this.userChoices.log2990) {
            window.alert(mode + ' is unavailable at the moment');
        }
    }
}
