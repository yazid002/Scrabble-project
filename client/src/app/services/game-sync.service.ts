import { Injectable, Output } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Case } from '@app/classes/case';
import { Goal } from '@app/classes/goal';
import { ICharacter } from '@app/classes/letter';
import { Player, PLAYER } from '@app/classes/player';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GameService } from './game.service';
import { GoalService } from './goal.service';
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
    publicGoals: Goal[];
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
        private goalService: GoalService,
    ) {
        this.alreadyInitialized = false;
        this.initialize();
        // this.sendToLocalStorage();
    }
    initialize() {
        if (this.alreadyInitialized) return;
        this.alreadyInitialized = true;
        this.sendGameStateSignal = new BehaviorSubject<GameState>(this.getGameState());
        this.sendAbandonSignal = new BehaviorSubject<string>('');
        this.sendOtherPlayerTrigger = this.gameService.otherPlayerSignal.subscribe((numPlayers: string) => {
            if (numPlayers !== 'multiplayer') {
                // this.sendToLocalStorage();
                return;
            }
            this.sendToServer();
        });
        this.abandonTrigger = this.gameService.abandonSignal.subscribe((reason: string) => {
            this.sendAbandonSignal.next(reason);
        });

        this.alreadySynced = false;
    }
    receiveFromServer(gameState: GameState) {
        this.reserveService.alphabets = gameState.alphabetReserve;
        // who is the 'Other Player' is different for the other player
        this.gameService.players[PLAYER.otherPlayer] = gameState.players[PLAYER.realPlayer];
        this.gameService.currentTurn = (gameState.currentTurn + 1) % 2;
        this.gameService.skipCounter = gameState.skipCounter;
        this.timerService.counter.totalTimer = gameState.timer;
        this.goalService.publicGoals = gameState.publicGoals;
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

    recieveFromLocalStorege() {
        const gameState = JSON.parse(localStorage.getItem('gameState') as string) as GameState;

        this.reserveService.alphabets = gameState.alphabetReserve;
        this.gameService.players[PLAYER.otherPlayer] = gameState.players[PLAYER.realPlayer];
        this.gameService.currentTurn = (gameState.currentTurn + 1) % 2;
        this.gameService.skipCounter = gameState.skipCounter;
        this.timerService.counter.totalTimer = gameState.timer;
        for (let i = 0; i < tiles.length; i++) {
            tiles[i] = gameState.grid[i];
        }
        this.gridService.drawGrid();
    }

    sendToLocalStorage() {
        const sendingDelay = 1000;
        setInterval(() => {
            const gameState = this.getGameState();
            localStorage.clear();

            localStorage.setItem('gameState', JSON.stringify(gameState));
        }, sendingDelay);
    }
    getGameState(): GameState {
        this.placeSelectionService.cancelPlacement();

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
            publicGoals: this.goalService.publicGoals,
        };
        return gameState;
    }

    reset(): GameState {
        const resetGrid: Case[][] = tiles;
        for (let i = 0; i < tiles.length; i++) {
            resetGrid[i] = tiles[i];
        }

        const initialReserve = this.reserveService.getInitialReserve();
        const gameState: GameState = {
            players: [],
            alphabetReserve: initialReserve,
            currentTurn: 0,
            skipCounter: 0,
            timer: 0,
            grid: resetGrid,
            publicGoals: this.goalService.publicGoals,
        };

        return gameState;
    }

    receiveResetConfig() {
        const resetGame = this.reset();

        this.reserveService.alphabets = resetGame.alphabetReserve;
        this.gameService.players[PLAYER.otherPlayer] = resetGame.players[PLAYER.realPlayer];
        this.gameService.currentTurn = (resetGame.currentTurn + 1) % 2;
        this.gameService.skipCounter = resetGame.skipCounter;
        this.timerService.counter.totalTimer = resetGame.timer;
        for (let i = 0; i < tiles.length; i++) {
            tiles[i] = resetGame.grid[i];
        }
        this.gridService.drawGrid();
    }
}
