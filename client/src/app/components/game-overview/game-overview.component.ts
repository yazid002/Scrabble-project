import { Component, OnInit } from '@angular/core';
import * as GAME_SETTINGS from '@app/classes/game-options';
import { UserSettingsService } from '@app/services/user-settings.service';
@Component({
    selector: 'app-game-overview',
    templateUrl: './game-overview.component.html',
    styleUrls: ['./game-overview.component.scss'],
})
export class GameOverviewComponent implements OnInit {
    mode: GAME_SETTINGS.IOption;
    level: GAME_SETTINGS.IOption;
    numPlayers: GAME_SETTINGS.IOption;
    player: GAME_SETTINGS.ITextChoice;
    // settings = userSettingsService.settings;
    constructor(public userSettingsService: UserSettingsService) {}
    ngOnInit(): void {
        console.log(this.userSettingsService.settings);
        const mode = this.userSettingsService.settings.modes.options.find(
            (option) => option.key === this.userSettingsService.settings.modes.userValueKey,
        );
        const level = this.userSettingsService.settings.computerLevel.options.find(
            (option) => option.key === this.userSettingsService.settings.computerLevel.userValueKey,
        );
        const numPlayers = this.userSettingsService.settings.numPlayers.options.find(
            (option) => option.key === this.userSettingsService.settings.numPlayers.userValueKey,
        );
        console.log(mode, level, numPlayers);

        // const player = this.userSettingsService.
        // if (mode && level && numPlayers) {
        //     this.mode = mode;
        //     this.level = level;
        //     this.numPlayers = numPlayers;
        // } else {
        //     window.location.replace('/home');
        // }
        // console.log('mode', this.mode);
    }
}
