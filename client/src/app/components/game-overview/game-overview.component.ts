import { Component, OnInit } from '@angular/core';
import { UserSettingsService } from '@app/services/user-settings.service';

@Component({
    selector: 'app-game-overview',
    templateUrl: './game-overview.component.html',
    styleUrls: ['./game-overview.component.scss'],
})
export class GameOverviewComponent implements OnInit {
    mode: string;
    numPlayers: string;
    computerLevel: string;
    constructor(public userSettingsService: UserSettingsService) {}
    ngOnInit(): void {
        console.log('In the game overview');
        const mode = this.userSettingsService.settings.mode.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.mode.currentChoiceKey,
        );
        const numPlayers = this.userSettingsService.settings.numPlayers.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.numPlayers.currentChoiceKey,
        );
        const computerLevel = this.userSettingsService.settings.computerLevel.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.computerLevel.currentChoiceKey,
        );
        console.log(mode, numPlayers, computerLevel);
        if (mode && numPlayers && computerLevel) {
            this.mode = mode.value;
            this.numPlayers = numPlayers.value;
            this.computerLevel = computerLevel.value;
        }
    }
}
