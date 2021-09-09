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
        scores: 'Meilleurs Scores',
    };
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor(public dialog: MatDialog) {}

    openDialog(mode: string) {
        mode.replace('c', 'c');
        this.dialog.open(GameModeDialogComponent);
    }
}
