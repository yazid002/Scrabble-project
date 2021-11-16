import { Component, OnInit } from '@angular/core';
import { IOption } from '@app/classes/game-options';
import { Goal } from '@app/classes/goal';
import { PLAYER } from '@app/classes/player';
import { GameService } from '@app/services/game.service';
import { GoalService } from '@app/services/goal.service';
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
    goals: Goal;
    mode: string;
    numPlayers: string;
    computerLevel: string;
    timer: string;
    playerIndex = PLAYER;
    nbLettersReserve: number = 0;
    otherPlayerName: string = '';
    publicGoals: Goal[];
    constructor(
        public userSettingsService: UserSettingsService,
        public timerService: TimerService,
        public reserveService: ReserveService,
        public placeService: PlaceService,
        public gameService: GameService,
        public goalService: GoalService,
    ) {}
    ngOnInit(): void {
        this.updateData();
        console.log(this.goalService);
        for (const player of this.gameService.players) {
            player.privateGoals.push(this.goalService.displayGoals());
            console.log(this.goalService.usedIndex);
        }
    }

    private updateData(): void {
        const reserveRefreshRate = 1000;
        setInterval(() => {
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

            const publicGoals = this.goalService.publicGoals
                ? this.goalService.publicGoals
                : (this.goalService.publicGoals = [this.goalService.displayGoals(), this.goalService.displayGoals()]);
            this.assignValues(mode, numPlayers, computerLevel, timer, publicGoals);
            this.nbLettersReserve = this.reserveService.getQuantityOfAvailableLetters();
        }, reserveRefreshRate);
    }
    private assignValues(
        mode: IOption | undefined,
        numPlayers: IOption | undefined,
        computerLevel: IOption | undefined,
        timer: IOption | undefined,
        publicGoals: Goal[] | undefined,
    ) {
        if (mode && numPlayers && computerLevel && timer && publicGoals) {
            this.mode = mode.value;
            this.numPlayers = numPlayers.value;
            this.computerLevel = computerLevel.value;
            this.timer = timer.value;
            this.publicGoals = [...publicGoals];
        }
    }
}
