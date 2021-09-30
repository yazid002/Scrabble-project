import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
    nbLettersChevalet: number = 5;
    nbLettersReserve: number = 0;

    constructor(
        public userSettingsService: UserSettingsService,
        public timerService: TimerService,
        public reserveService: ReserveService,
        private cd: ChangeDetectorRef,
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

        if (mode && numPlayers && computerLevel && timer) {
            this.mode = mode.value;
            this.numPlayers = numPlayers.value;
            this.computerLevel = computerLevel.value;
            this.timer = timer.value;
        }
        this.getReserveSize();
    }
    private getReserveSize(): void {
        setTimeout(() => {
            this.reserveService.getReserveSize().subscribe((size) => (this.nbLettersReserve = size));
            this.cd.detectChanges();
        }, 0);
    }
}
