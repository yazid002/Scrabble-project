import { Injectable, Output } from '@angular/core';
import { Player } from '@app/classes/player';
import { RACK_SIZE } from '@app/constants/rack-constants';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ReserveService } from './reserve.service';
import { TimerService } from './timer.service';
import { UserSettingsService } from './user-settings.service';

export const REAL_PLAYER = 0;
export const COMPUTER = 1;
const MAX_SKIPS = 6;
@Injectable({
    providedIn: 'root',
})
export class GameService {
    @Output() otherPlayerSignal = new BehaviorSubject<boolean>(true);
    players: Player[] = [];
    currentTurn: number;
    timerDone: Subscription;
    turnDone: Subscription;
    skipCounter: number = 0;
    constructor(private userSettingsService: UserSettingsService, private reserveService: ReserveService, private timerService: TimerService) {
        this.startGame();
        this.randomTurn();
        this.timerDone = this.timerService.timerDone.subscribe((skipped: boolean) => {
            this.changeTurn(skipped);
        });
    }

    changeTurn(skipped: boolean) {
        if (skipped) {
            this.skipCounter++;
        }
        if (this.skipCounter < MAX_SKIPS) {
            
            this.currentTurn = (this.currentTurn + 1) % 2;
            if (this.currentTurn === COMPUTER) {
                this.virtualPlaySignal.next(true);
            }
        }
    }
    getNumPlayerInstructions(key: string): () => void {
        const numPlayerMap: Map<string, () => void> = new Map([
            ['solo', () => this.initSoloPlayers()],
            ['multiplayer', () => this.initMultiPlayers()],
        ]);

        const makePlayers = numPlayerMap.get(key) as () => void;
        return makePlayers;
    }
    private startGame() {
        const makePlayers = this.getNumPlayerInstructions(this.userSettingsService.settings.numPlayers.currentChoiceKey);
        makePlayers();
    }
    private initSoloPlayers() {
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
    private initMultiPlayers() {}
    private randomTurn() {
        this.currentTurn = Math.floor(2 * Math.random());
    }
}
