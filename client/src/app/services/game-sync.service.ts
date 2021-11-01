import { Injectable, Output } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Case } from '@app/classes/case';
import { ICharacter } from '@app/classes/letter';
import { Player } from '@app/classes/player';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GameService, OTHER_PLAYER, REAL_PLAYER } from './game.service';
import { GridService } from './grid.service';
import { PlaceSelectionService } from './place-selection.service';
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
    @Output() sendAbandonSignal: BehaviorSubject<string>;
    sendOtherPlayerTrigger: Subscription;
    abandonTrigger: Subscription;
    isMasterClient: boolean;
    private alreadySynced: boolean;
    private alreadyInitialized: boolean;
    constructor(
        private gameService: GameService,
        private reserveService: ReserveService,
        private timerService: TimerService,
        private gridService: GridService,
        private placeSelectionService: PlaceSelectionService,
    ) {
        this.alreadyInitialized = false;
        this.initialize();
    }
    initialize() {
        if (this.alreadyInitialized) return;
        this.alreadyInitialized = true;
        this.sendGameStateSignal = new BehaviorSubject<GameState>(this.getGameState());
        this.sendAbandonSignal = new BehaviorSubject<string>('');
        this.sendOtherPlayerTrigger = this.gameService.otherPlayerSignal.subscribe((numPlayers: string) => {
            if (numPlayers !== 'multiplayer') return;
            this.sendToServer();
        });
        this.abandonTrigger = this.gameService.abandonSignal.subscribe((reason: string) => {
            this.sendAbandonSignal.next(reason);
        });

        this.alreadySynced = false;
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

        if (!this.alreadySynced) {
            this.alreadySynced = true;
            this.sendToServer();
        }
    }
    sendToServer() {
        const gameState = this.getGameState();
        this.sendGameStateSignal.next(gameState);
    }
    private getGameState(): GameState {
        //   for (const player of this.gameService.players) {
        //   if (player.placementParameters) {
        this.placeSelectionService.cancelPlacement();
        //   }
        // }

        const tempGrid: Case[][] = tiles;
        for (let i = 0; i < tiles.length; i++) {
            tempGrid[i] = tiles[i];
        }
        const gameState: GameState = {
            players: this.gameService.players,
            alphabetReserve: this.reserveService.alphabets,
            currentTurn: this.gameService.currentTurn,
            skipCounter: this.gameService.skipCounter,
            timer: this.timerService.counter.totalTimer,
            grid: tempGrid,
        };
        return gameState;
    }
}
