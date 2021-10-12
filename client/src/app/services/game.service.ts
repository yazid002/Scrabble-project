import { Injectable, Output } from '@angular/core';
import { Player } from '@app/classes/player';
import { RACK_SIZE } from '@app/constants/rack-constants';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReserveService } from './reserve.service';
import { TimerService } from './timer.service';
import { UserSettingsService } from './user-settings.service';

export const REAL_PLAYER = 0;
export const COMPUTER = 1;
@Injectable({
    providedIn: 'root',
})
export class GameService {
    @Output() virtualPlaySignal = new BehaviorSubject<boolean>(true);
    players: Player[] = [];
    currentTurn: number;
    timerDone: Subscription;
    turnDone: Subscription;
    constructor(private userSettingsService: UserSettingsService, private reserveService: ReserveService, private timerService: TimerService) {
        this.initializePlayers();
        this.randomTurn();
        this.timerDone = this.timerService.timerDone.subscribe(() => {
            this.changeTurn();
        });
    }

    changeTurn() {
        this.currentTurn = (this.currentTurn + 1) % 2;
        if (this.currentTurn === COMPUTER) {
            console.log("signal emited");
            this.virtualPlaySignal.next(true);
        }
    }
    private initializePlayers() {
        const realPlayer: Player = {
            id: REAL_PLAYER,
            name: this.userSettingsService.nameOption.userChoice,
            rack: this.reserveService.getLettersFromReserve(RACK_SIZE),
            points: 0,
        };
        this.players.push(realPlayer);
        const computer: Player = {
            id: COMPUTER,
            name: this.userSettingsService.computerName,
            rack: this.reserveService.getLettersFromReserve(RACK_SIZE),
            points: 0,
        };
        this.players.push(computer);
    }
    private randomTurn() {
        this.currentTurn = Math.floor(2 * Math.random());
    }
}
