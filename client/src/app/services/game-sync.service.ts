import { Injectable, Output } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Case } from '@app/classes/case';
import { ICharacter } from '@app/classes/letter';
import { Player } from '@app/classes/player';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GameService, OTHER_PLAYER, REAL_PLAYER } from './game.service';
import { GridService } from './grid.service';
import { ReserveService } from './reserve.service';
import { TimerService } from './timer.service';
export interface GameState {
    players: Player[];
    alphabetReserve: ICharacter[];
    currentTurn: number;
    skipCounter: number;
    timer: number;
    grid: Case[][];
}
@Injectable({
    providedIn: 'root',
})
export class GameSyncService {
    @Output() sendGameStateSignal: BehaviorSubject<GameState>;
    sendOtherPlayerTrigger: Subscription;
    isMasterClient: boolean;
    constructor(
        private gameService: GameService,
        private reserveService: ReserveService,
        private timerService: TimerService,
        private gridService: GridService,
    ) {
        this.sendGameStateSignal = new BehaviorSubject<GameState>(this.getGameState());
        this.sendOtherPlayerTrigger = this.gameService.otherPlayerSignal.subscribe((numPlayers: string) => {
            if (numPlayers !== 'multiplayer') return;
            this.sendToServer();
        });
    }
    receiveFromServer(gameState: GameState) {
        this.reserveService.alphabets = gameState.alphabetReserve;
        this.gameService.players[OTHER_PLAYER] = gameState.players[REAL_PLAYER]; // who is the 'Other Player' is different for the other player
        this.gameService.currentTurn = (gameState.currentTurn + 1) % 2;
        this.gameService.skipCounter = gameState.skipCounter;
        this.timerService.counter.totalTimer = gameState.timer;
        for (let i = 0; i < tiles.length; i++) {
            tiles[i] = gameState.grid[i];
        }
        this.gridService.drawGrid();
        console.log('receiving data from server!', this.getGameState());
    }
    sendToServer() {
        const gameState = this.getGameState();
        console.log('sending data to server', gameState);
        this.sendGameStateSignal.next(gameState);
    }
    private getGameState(): GameState {
        const gameState: GameState = {
            players: this.gameService.players,
            alphabetReserve: this.reserveService.alphabets,
            currentTurn: this.gameService.currentTurn,
            skipCounter: this.gameService.skipCounter,
            timer: this.timerService.counter.totalTimer,
            grid: tiles,
        };
        return gameState;
    }
}
