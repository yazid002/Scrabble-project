import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameModeDialogComponent } from '@app/components/game-mode-dialog/game-mode-dialog.component';
import { UserSettingsService } from '@app/services/user-settings.service';
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    readonly title: string = 'LOG2990';

    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor(public matDialog: MatDialog, public userSettingsService: UserSettingsService) {}
    chooseMode(modeKey: string) {
        this.userSettingsService.settings.mode.currentChoiceKey = modeKey;
        this.openDialog();
    }

    ngOnInit(): void {
        localStorage.clear();
    }

    private openDialog() {
        this.matDialog.open(GameModeDialogComponent);
    }
}
