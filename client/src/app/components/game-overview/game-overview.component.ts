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
    timer: string;
    constructor(public userSettingsService: UserSettingsService) {}
    ngOnInit(): void {
        const mode = this.userSettingsService.settings.mode.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.mode.currentChoiceKey,
        );
        const numPlayers = this.userSettingsService.settings.numPlayers.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.numPlayers.currentChoiceKey,
        );
        const computerLevel = this.userSettingsService.settings.computerLevel.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.computerLevel.currentChoiceKey,
        );

        const timer = this.userSettingsService.settings.timer.setting.availableChoices.find(
            (key) => key.key === this.userSettingsService.settings.timer.currentChoiceKey,
        );

        if (mode && numPlayers && computerLevel && timer) {
            this.mode = mode.value;
            this.numPlayers = numPlayers.value;
            this.computerLevel = computerLevel.value;
            this.timer = timer.value;
        }
    }
}
