import { Component, OnInit } from '@angular/core';
import { IOption } from '@app/classes/game-options';
import { COMPUTER as COMPUTER_INDEX, GameService, REAL_PLAYER as REAL_PLAYER_INDEX } from '@app/services/game.service';
import { PlaceService } from '@app/services/place.service';
import { ReserveService } from '@app/services/reserve.service';
import { TimerService } from '@app/services/timer.service';
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
    computerIndex = COMPUTER_INDEX;
    realPlayerIndex = REAL_PLAYER_INDEX;
    nbLettersReserve: number = 0;
    otherPlayerName: string = '';
    constructor(
        public userSettingsService: UserSettingsService,
        public timerService: TimerService,
        public reserveService: ReserveService,
        public placeService: PlaceService,
        public gameService: GameService,
    ) {}
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

        this.assignValues(mode, numPlayers, computerLevel, timer);

        this.updateData();
    }
    private updateData(): void {
        const reserveRefreshRate = 1000;
        setInterval(() => {
            this.nbLettersReserve = this.reserveService.getQuantityOfAvailableLetters();
        }, reserveRefreshRate);
    }
    private assignValues(mode: IOption | undefined, numPlayers: IOption | undefined, computerLevel: IOption | undefined, timer: IOption | undefined) {
        if (mode && numPlayers && computerLevel && timer) {
            this.mode = mode.value;
            this.numPlayers = numPlayers.value;
            this.computerLevel = this.numPlayers === 'solo' ? computerLevel.value : '';
            this.timer = timer.value;
        }
    }
}
