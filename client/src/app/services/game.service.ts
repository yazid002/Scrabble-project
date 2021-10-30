import { Injectable, Output } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { Player } from '@app/classes/player';
import { RACK_SIZE } from '@app/constants/rack-constants';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ChatService } from './chat.service';
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
    @Output() whoWon = new BehaviorSubject<number>(-1);

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
    ) {
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
        this.endGame();
    }
    private didGameEnd(): boolean {
        let hasEnded = false;
        if (this.skipCounter >= MAX_SKIPS) {
            hasEnded = true;
        }
        const isReserveEmpty = this.reserveService.alphabets.length === 0;
        let isRackEmpty = false;
        for (const player of this.players) {
            if (player.rack.length === 0) {
                isRackEmpty = true;
            }
        }
        if (isReserveEmpty && isRackEmpty) {
            hasEnded = true;
        }
        return hasEnded;
    }
    private endGame() {
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
            endGameString += this.players[playerIndex].rack.map((character) => character.affiche).join('<br>    ');

        }

        const endGameMessage: IChat = {
            from: SENDER.computer,
            body: endGameString,
        };
        this.chatService.addMessage(endGameMessage);
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
