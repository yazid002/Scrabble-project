import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameModeDialogComponent } from '@app/components/game-mode-dialog/game-mode-dialog.component';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { BehaviorSubject } from 'rxjs';
import { JoinRoomDialogComponent } from './../../components/join-room-dialog/join-room-dialog.component';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
    readonly title: string;

    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor(public matDialog: MatDialog, public userSettingsService: UserSettingsService, private soundManagerService: SoundManagerService) {
        this.title = 'LOG2990';
    }

    ngOnInit(): void {
        localStorage.clear();
    }

    playClickSound() {
        this.soundManagerService.playClickOnButtonAudio();
    }
    openCreateRoomDialog() {
        this.matDialog.open(GameModeDialogComponent);
        this.playClickSound();
    }

    openJoinRoomDialog() {
        this.userSettingsService.settings.numPlayers.currentChoiceKey = 'multiplayer';
        this.matDialog.open(JoinRoomDialogComponent);
        this.playClickSound();
    }
}
