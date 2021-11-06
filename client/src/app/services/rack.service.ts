import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { PLAYER } from '@app/classes/player';
import { NOT_FOUND } from '@app/constants/common-constants';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { ReserveService } from '@app/services/reserve.service';
import { GameService } from './game.service';

@Injectable({
    providedIn: 'root',
})
export class RackService {
    rackContext: CanvasRenderingContext2D;
    constructor(private reserveService: ReserveService, public gameService: GameService) {}

    displayRack() {
        for (let x = 0; x < RACK_SIZE; x++) {
            this.fillRackPortion(x, 'NavajoWhite');
        }
    }

    replaceLetter(letterToReplace: string, onRackOnly: boolean, index?: number): void {
        const indexOnRack = index ? index : this.findLetterPosition(letterToReplace);
        if (indexOnRack !== NOT_FOUND) {
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

    isLetterOnRack(letterToCheck: string, rack?: ICharacter[]): boolean {
        return this.findLetterPosition(letterToCheck, rack) !== NOT_FOUND;
    }

    findLetterPosition(letterToCheck: string, rack?: ICharacter[]): number {
        const rackToCheck = rack ? rack : this.gameService.players[this.gameService.currentTurn].rack;
        return rackToCheck.findIndex((letter) => letter.name === letterToCheck.toUpperCase()) as number;
    }

    fillRackPortion(index: number, color: string = 'NavajoWhite') {
        const LETTERS_PIXELS_WIDTH_ADJUSTMENT = 6;
        const LETTERS_PIXELS_HEIGH_ADJUSTMENT = 8;
        const POINTS_PIXELS_WIDTH_ADJUSTMENT = 25;
        const POINTS_PIXELS_HEIGH_ADJUSTMENT = 1;

        this.rackContext.clearRect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.rect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.fillStyle = color;
        this.rackContext.fillRect((DEFAULT_WIDTH / RACK_SIZE) * index, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT);
        this.rackContext.fillStyle = 'rgb(0,0,0)';
        this.rackContext.font = '30px serif';
        if (this.gameService.players[PLAYER.realPlayer].rack[index]) {
            this.rackContext.fillText(
                this.gameService.players[PLAYER.realPlayer].rack[index].display,
                (DEFAULT_WIDTH / RACK_SIZE) * index + LETTERS_PIXELS_WIDTH_ADJUSTMENT,
                DEFAULT_HEIGHT - LETTERS_PIXELS_HEIGH_ADJUSTMENT,
            );

            this.rackContext.font = '10px serif';
            this.rackContext.fillText(
                this.gameService.players[PLAYER.realPlayer].rack[index].points.toString(),
                (DEFAULT_WIDTH / RACK_SIZE) * index + POINTS_PIXELS_WIDTH_ADJUSTMENT,
                DEFAULT_HEIGHT - POINTS_PIXELS_HEIGH_ADJUSTMENT,
            );
        }
        this.rackContext.stroke();
    }
}
