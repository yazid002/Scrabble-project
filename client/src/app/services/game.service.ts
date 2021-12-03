import { Injectable, Output } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { Player, PLAYER } from '@app/classes/player';
import { ABANDON_SIGNAL } from '@app/classes/signal';
import { RACK_SIZE } from '@app/constants/rack-constants';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ChatService } from './chat.service';
import { Leaderboard, LeaderboardService } from './leaderboard.service';
import { ReserveService } from './reserve.service';
import { TimerService } from './timer.service';
import { UserSettingsService } from './user-settings.service';
const MAX_SKIPS = 6;
@Injectable({
    providedIn: 'root',
})
export class GameService {
    @Output() otherPlayerSignal = new BehaviorSubject<string>('');
    @Output() abandonSignal = new BehaviorSubject<string>('');
    @Output() convertToSoloSignal = new BehaviorSubject<string>('');
    @Output() endGameSignal = new BehaviorSubject<Leaderboard>({ name: '', score: 0, mode: 'classic' });

    players: Player[] = [];
    currentTurn: number;
    timerDone: Subscription;
    turnDone: Subscription;
    numPlayers: string;
    skipCounter: number = 0;
    constructor(
        private userSettingsService: UserSettingsService,
        private reserveService: ReserveService,
        private timerService: TimerService,
        private chatService: ChatService,
        public leaderboardService: LeaderboardService,
    ) {
        this.initPlayers();
        this.timerDone = this.timerService.timerDone.subscribe((skipped: boolean) => {
            this.changeTurn(skipped);
        });
        this.numPlayers = this.userSettingsService.settings.numPlayers.currentChoiceKey;
    }
    convertGameToSolo() {
        this.numPlayers = 'solo';
        this.convertToSoloSignal.next(ABANDON_SIGNAL);
        if (this.currentTurn === PLAYER.otherPlayer) {
            this.otherPlayerSignal.next(this.numPlayers);
        }
    }
    quitGame() {
        this.abandonSignal.next('abandon');
        this.endGame();
    }
    async endGame(otherPlayerAbandonned: boolean = false): Promise<void> {
        this.timerService.isEnabled = false;
        let endGameString = `Fin de partie: ${this.reserveService.alphabets.length} lettres restantes`;
        for (let playerIndex = 0; playerIndex < this.players.length; playerIndex++) {
            const player = this.players[playerIndex];
            const otherPlayer = this.players[(playerIndex + 1) % 2];
            // substract points
            if (player.rack.length === 0) {
                player.points += this.subtractPoint(otherPlayer);
            } else {
                player.points -= this.subtractPoint(player);
            }

            // determine who won
            if (player.points >= otherPlayer.points) {
                player.won = 'Vous avez gagné!';
            }

            endGameString += '<br>' + this.players[playerIndex].name + ' :<br>';
            endGameString += this.players[playerIndex].rack.map((character) => character.display).join('<br>    ');
        }
        if (otherPlayerAbandonned) {
            this.players[PLAYER.realPlayer].won = 'Votre adversaire a abandonné. Vous gagnez par défaut!';
            this.players[PLAYER.otherPlayer].won = undefined;
        }

        const endGameMessage: IChat = {
            from: SENDER.computer,
            body: endGameString,
        };
        this.chatService.addMessage(endGameMessage);

        const realPlayer: Leaderboard = {
            name: this.players[PLAYER.realPlayer].name,
            score: this.players[PLAYER.realPlayer].points,
            mode: this.userSettingsService.settings.mode.currentChoiceKey,
        };
        this.endGameSignal.next(realPlayer);
    }
    didGameEnd(): boolean {
        let hasEnded = false;
        if (this.skipCounter >= MAX_SKIPS) {
            hasEnded = true;
        }
        const isReserveEmpty = this.reserveService.alphabets.length === 0;
        for (const player of this.players) {
            if (player.rack.length === 0 && isReserveEmpty) {
                hasEnded = true;
            }
        }

        return hasEnded;
    }
    initPlayers() {
        if (this.players.length !== 0) return;
        const realPlayer: Player = {
            id: PLAYER.realPlayer,
            name: this.userSettingsService.nameOption.userChoice,
            rack: this.reserveService.getLettersFromReserve(RACK_SIZE),
            points: 0,
            placeInTenSecondsGoalCounter: 0,
            turnWithoutSkipAndExchangeCounter: 0,
            wordsMapping: new Map<string, number>(),
            words: [],
        };
        this.players.push(realPlayer);

        // make computer just two have two players
        const computer: Player = {
            id: PLAYER.otherPlayer,
            name: this.userSettingsService.getComputerName(),
            rack: this.reserveService.getLettersFromReserve(RACK_SIZE),
            points: 0,
            placeInTenSecondsGoalCounter: 0,
            turnWithoutSkipAndExchangeCounter: 0,
            wordsMapping: new Map<string, number>(),
            words: [],
        };
        this.players.push(computer);
        this.randomTurn();
    }
    private subtractPoint(player: Player): number {
        let pointToSub = 0;
        for (const letter of player.rack) {
            pointToSub -= letter.points;
        }
        return pointToSub;
    }
    private changeTurn(skipped: boolean): void {
        if (skipped) {
            this.skipCounter++;
        } else {
            this.skipCounter = 0;
        }
        if (this.didGameEnd()) {
            this.endGame();
        } else {
            this.currentTurn = (this.currentTurn + 1) % 2;
            if (this.currentTurn === PLAYER.otherPlayer) {
                this.nextPlayer();
            }
        }
    }
    private nextPlayer() {
        this.otherPlayerSignal.next(this.numPlayers);
    }

    private randomTurn() {
        this.currentTurn = Math.floor(2 * Math.random());
        this.changeTurn(false);
    }
}
