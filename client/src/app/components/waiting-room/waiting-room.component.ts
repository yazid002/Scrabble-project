import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IOption } from '@app/classes/game-options';
import { TitleDescriptionOfDictionary } from '@app/pages/admin-page/models/title-description-of-dictionary.model';
import { RoomService } from '@app/services/room.service';
import { SoundManagerService } from '@app/services/sound-manager.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { QuitMultiplayerDialogComponent } from './../quit-multiplayer-dialog/quit-multiplayer-dialog.component';
import { SwitchDialogComponent } from './../switch-dialog/switch-dialog.component';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss', './waiting-room.component-buttons.scss'],
})
export class WaitingRoomComponent implements OnInit {
    name: string;
    mode: string;
    timer: string;
    dictionary: TitleDescriptionOfDictionary;

    constructor(
        public userSettingsService: UserSettingsService,
        public matDialog: MatDialog,
        public roomService: RoomService,
        public soundManagerService: SoundManagerService,
    ) {}
    ngOnInit(): void {
        const name = this.userSettingsService.nameOption.userChoice;
        const mode = this.userSettingsService.settings.mode.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.mode.currentChoiceKey,
        );
        const timer = this.userSettingsService.settings.timer.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.timer.currentChoiceKey,
        );

        const dict = this.userSettingsService.selectedDictionary;
        this.assignValues(name, mode, timer, dict);
        this.roomService.createRoom();
    }
    openSwitchToSoloDialog() {
        this.matDialog.open(SwitchDialogComponent);
    }
    openQuitMultiplayerDialog() {
        this.matDialog.open(QuitMultiplayerDialogComponent);
    }

    playClickOnButtonAudio() {
        this.soundManagerService.playClickOnButtonAudio();
    }
    private assignValues(
        name: string | undefined,
        mode: IOption | undefined,
        timer: IOption | undefined,
        dict: TitleDescriptionOfDictionary | undefined,
    ) {
        if (name && mode && timer && dict) {
            this.name = name;
            this.mode = mode.value;
            this.timer = timer.value;
            this.dictionary = dict;
        }
    }
}
