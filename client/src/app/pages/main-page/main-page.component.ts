import { GameService } from './../../services/game.service';
import { JoinRoomDialogComponent } from './../../components/join-room-dialog/join-room-dialog.component';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameModeDialogComponent } from '@app/components/game-mode-dialog/game-mode-dialog.component';
import { SoundManagerService } from '@app/services/sound-manager.service';
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
    constructor(
        public matDialog: MatDialog,
        public userSettingsService: UserSettingsService,
        private soundManagerService: SoundManagerService,
        public gameService: GameService,
    ) {}
    // chooseMode(modeKey: string) {
    //     this.userSettingsService.settings.mode.currentChoiceKey = modeKey;
    //     this.openDialog();
    // }

    ngOnInit(): void {
        localStorage.clear();
    }

    playClickSound() {
        this.soundManagerService.playClickOnButtonAudio();
    }

    // playMainPageSound() {
    //     this.soundManagerService.playMainPageAudio();
    // }

    openCreateRoomDialog() {
        this.matDialog.open(GameModeDialogComponent);
        this.playClickSound();
    }

    openJoinRoomDialog() {
        this.gameService.numPlayers = 'multiplayer';
        // this.goalsManagerService.isEnabled = this.userSettingsService.settings.mode.currentChoiceKey === 'log2990';
        this.userSettingsService.settings.numPlayers.currentChoiceKey = 'multiplayer';
        this.matDialog.open(JoinRoomDialogComponent);
        this.playClickSound();
    }
}
