import { Injectable } from '@angular/core';
import { RACK_SIZE } from '@app/constants/rack-constants';
import { Subscription } from 'rxjs';
import { ExchangeService } from './exchange.service';
import { COMPUTER, GameService } from './game.service';
import { TimerService } from './timer.service';

@Injectable({
    providedIn: 'root',
})
export class VirtualPlayerService {
    virtualPlayerSignal: Subscription;
    private alreadyInitialized: boolean;
    constructor(private gameService: GameService, private exchangeService: ExchangeService, private timerService: TimerService) {
        this.alreadyInitialized = false;
        this.initialize();
    }
    initialize() {
        if (this.alreadyInitialized) return;
        this.alreadyInitialized = true;
        this.virtualPlayerSignal = this.gameService.otherPlayerSignal.subscribe((numPlayers: string) => {
            if (numPlayers !== 'solo') return;
            this.play();
        });
    }
    private play() {
        const TURN_TIME = 3000;
        let skipped = false;
        setTimeout(() => {
            const oneOfTenProbability = 10;
            const randomNumber = Math.floor(oneOfTenProbability * Math.random());
            if (randomNumber === 0) {
                skipped = true;
            } else if (randomNumber === 1) {
                this.exchange();
            } else {
                this.place();
            }
            this.timerService.resetTimer(skipped);
        }, TURN_TIME);
    }

    private selectRandomLetterFromRack(numberOfLetters: number): string[] {
        const lettersToChange: string[] = [];
        const numbersPicked: number[] = [];
        const numbs: number[] = [];
        let numb = 0;

        for (let i = 0; i < this.gameService.players[COMPUTER].rack.length; i++) {
            numbs.push(i);
        }

        if (numberOfLetters <= this.gameService.players[COMPUTER].rack.length) {
            for (let i = 0; i < numberOfLetters; i++) {
                numb = Math.floor(Math.random() * numbs.length);
                numbersPicked.push(numbs[numb]);
                numbs.splice(numb, 1);
            }
            for (let i = 0; i < numberOfLetters; i++) {
                lettersToChange.push(this.gameService.players[COMPUTER].rack[numbersPicked[i]].name);
            }
        }
        return lettersToChange;
    }
    private exchange() {
        const numberToChange = Math.floor(Math.random() * RACK_SIZE + 1);
        const lettersToChange = this.selectRandomLetterFromRack(numberToChange);
        this.exchangeService.exchangeLetters(lettersToChange);
    }
    private place() {
        // TODO: commenter pour le merge, a enlever
        //  console.log('virtual player place');
    }
}
