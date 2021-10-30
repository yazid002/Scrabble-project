import { Injectable, Output } from '@angular/core';
import { Player } from '@app/classes/player';
import { RACK_SIZE } from '@app/constants/rack-constants';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReserveService } from './reserve.service';
import { TimerService } from './timer.service';
import { UserSettingsService } from './user-settings.service';

export const REAL_PLAYER = 0;
export const COMPUTER = 1;
export const OTHER_PLAYER = 1;

const MAX_SKIPS = 6;
@Injectable({
    providedIn: 'root',
})
export class GameService {
    @Output() otherPlayerSignal = new BehaviorSubject<string>('');
    @Output() abandonSignal = new BehaviorSubject<string>('');

    players: Player[] = [];
    currentTurn: number;
    timerDone: Subscription;
    turnDone: Subscription;
    numPlayers: string;
    skipCounter: number = 0;
    constructor(private userSettingsService: UserSettingsService, private reserveService: ReserveService, private timerService: TimerService) {
        this.initPlayers();
        this.randomTurn();
        this.timerDone = this.timerService.timerDone.subscribe((skipped: boolean) => {
            this.changeTurn(skipped);
        });
        this.numPlayers = this.userSettingsService.settings.numPlayers.currentChoiceKey;
    }
    convertGameToSolo() {
        this.numPlayers = 'solo';
        if (this.currentTurn === OTHER_PLAYER) {
            this.otherPlayerSignal.next(this.numPlayers);
        }
    }
    quitGame() {
        this.abandonSignal.next('abandon');
    }
    private changeTurn(skipped: boolean): void {
        if (skipped) {
            this.skipCounter++;
        } else {
            this.skipCounter = 0;
        }
        if (this.skipCounter < MAX_SKIPS) {
            this.currentTurn = (this.currentTurn + 1) % 2;
            if (this.currentTurn === OTHER_PLAYER) {
                this.nextPlayer();
            }
        }
        // TODO: si skip counter trop grand, terminer la partie. Il faut implementer une fin de partie
    }
    private nextPlayer() {
        this.otherPlayerSignal.next(this.numPlayers);
    }
    private initPlayers() {
        const realPlayer: Player = {
            id: REAL_PLAYER,
            name: this.userSettingsService.nameOption.userChoice,
            rack: this.reserveService.getLettersFromReserve(RACK_SIZE),
            points: 0,
        };
        this.players.push(realPlayer);

        // make computer just two have two players
        const computer: Player = {
            id: COMPUTER,
            name: this.userSettingsService.getComputerName(),
            rack: this.reserveService.getLettersFromReserve(RACK_SIZE),
            points: 0,
        };
        this.players.push(computer);
    }

    private randomTurn() {
        this.currentTurn = Math.floor(2 * Math.random());
    }
}
