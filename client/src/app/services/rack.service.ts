import { Injectable } from '@angular/core';

import { DEFAULT_HEIGHT, DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { ReserveService } from '@app/services/reserve.service';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class RackService {
    rackContext: CanvasRenderingContext2D;

    

    constructor(private reserveService: ReserveService, private gameService: GameService) {
        console.log(this.gameService);

    }

    

    displayRack() {
        for (let x = 0; x < RACK_SIZE; x++) {
            this.fillRackPortion(x);
        }
    }

    replaceLetter(letterToReplace: string, onRackOnly: boolean): void {
        const notFound = -1;
        const indexOnRack = this.findLetterPosition(letterToReplace);
        if (indexOnRack !== notFound) {
            const newCharacters = this.reserveService.getLettersFromReserve(1);
            if (newCharacters.length !== 0) {
                if (!onRackOnly) {
                    this.reserveService.addLetterInReserve(this.gameService.players[this.gameService.currentTurn].rack[indexOnRack].name);
                }
                this.gameService.players[this.gameService.currentTurn].rack[indexOnRack] = newCharacters[0];
                this.fillRackPortion(indexOnRack);
            }
        }
    }

    replaceWord(word: string) {
        for (let letter of word) {
            if (letter === letter.toUpperCase()) {
                letter = '*';
            }
            this.replaceLetter(letter, true);
        }
    }

    checkLettersAvailability(limit: number): boolean {
        return this.reserveService.getQuantityOfAvailableLetters() > limit;
    }

    countLetterOccurrences(letterToCheck: string, letters: string[]): number {
        const count = letters.reduce((n, letter) => n + Number(letter.toUpperCase() === letterToCheck.toUpperCase()), 0);
        return count;
    }

    findJokersNumberOnRack(): number {
        const jokers = this.gameService.players[this.gameService.currentTurn].rack.filter((letter) => letter.name === '*');
        return jokers.length;
    }

    findInexistentLettersOnRack(lettersToChange: string[]): string[] {
        return [...new Set(lettersToChange.filter((letter: string) => this.isLetterOnRack(letter) === false))];
    }

    isLetterOnRack(letterToCheck: string): boolean {
        const notFound = -1;
        return this.findLetterPosition(letterToCheck) !== notFound;
    }

    private findLetterPosition(letterToCheck: string): number {
        return this.gameService.players[this.gameService.currentTurn].rack.findIndex(
            (letter) => letter.name === letterToCheck.toUpperCase(),
        ) as number;
    }

    private fillRackPortion(index: number) {
        const LETTERS_PIXELS_WIDTH_ADJUSTMENT = 6;
        const LETTERS_PIXELS_HEIGH_ADJUSTMENT = 8;
        const POINTS_PIXELS_WIDTH_ADJUSTMENT = 25;
        const POINTS_PIXELS_HEIGH_ADJUSTMENT = 1;

        this.rackContext.clearRect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.rect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.stroke();
        this.rackContext.fillStyle = 'NavajoWhite';
        this.rackContext.fillRect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.fillStyle = 'rgb(0,0,0)';
        this.rackContext.font = '30px serif';
        if (this.gameService.players[this.gameService.currentTurn].rack[index]) {
            this.rackContext.fillText(
                this.gameService.players[this.gameService.currentTurn].rack[index].affiche,
                (DEFAULT_WIDTH / RACK_SIZE) * index + LETTERS_PIXELS_WIDTH_ADJUSTMENT,
                DEFAULT_HEIGHT - LETTERS_PIXELS_HEIGH_ADJUSTMENT,
            );

            this.rackContext.font = '10px serif';
            this.rackContext.fillText(
                this.gameService.players[this.gameService.currentTurn].rack[index].points.toString(),
                (DEFAULT_WIDTH / RACK_SIZE) * index + POINTS_PIXELS_WIDTH_ADJUSTMENT,
                DEFAULT_HEIGHT - POINTS_PIXELS_HEIGH_ADJUSTMENT,
            );
        }
    }

    // TODO: ENLEVER SI ON EN A PAS BESOIN
    // private findWordOnRack(word: string[]): boolean {
    //     for (const w of word) {
    //         if (!this.isLetterOnRack(w)) {
    //             return false;
    //         }
    //     }
    //     return true;
    // }

    // findLetter(letterToCheck: string): ICaracter | void {
    //     let letter = letterToCheck;
    //     if (letterToCheck === letterToCheck.toUpperCase()) {
    //         letter = '*';
    //     }
    //     const index = this.findLetterPosition(letter);
    //     const notFound = -1;
    //     if (index !== notFound) {
    //         return this.rackLetters[index];
    //     }
    // }

    // private findLetterOccurrence(letterToCheck: string): ICaracter[] {
    //     return this.rackLetters?.filter((letter) => letter.name === letterToCheck.toUpperCase()) as ICaracter[];
    // }
}
