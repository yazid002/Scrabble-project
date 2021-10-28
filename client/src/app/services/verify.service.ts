import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { CommandSyntaxError } from '@app/classes/command-errors/command-syntax-errors/command-syntax-error';
import { NotEnoughOccurrences } from '@app/classes/command-errors/command-syntax-errors/not-enough-occurrences';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { Dictionary } from '@app/classes/dictionary';
import { Vec2 } from '@app/classes/vec2';
import { SQUARE_NUMBER } from '@app/constants/board-constants';
import { RackService } from '@app/services/rack.service';
import * as dictionary from 'src/assets/dictionnary.json';

@Injectable({
    providedIn: 'root',
})
export class VerifyService {
    dictionary: Dictionary = dictionary as Dictionary;
    invalidSymbols: string[] = ['-', "'"];
    bonuses: string[] = ['dl', 'tw', 'tl', 'dw'];

    constructor(private rackService: RackService) {}

    isFitting(coord: Vec2, direction: string, word: string): { letter: string; coord: Vec2 }[] {
        const remainingCases = direction === 'h' ? tiles.length - coord.x : tiles.length - coord.y;

        if (word.length > remainingCases) {
            throw new ImpossibleCommand("Il n'y a pas assez de place pour écrire ce mot");
        }

        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];
        for (let i = 0; i < word.length; i++) {
            const computedCoord = this.computeCoordByDirection(direction, coord, i);
            const x = computedCoord.x;
            const y = computedCoord.y;
            const charInBox = tiles[y][x].letter;
            const letter = word.charAt(i) === word.charAt(i).toUpperCase() ? '*' : word.charAt(i);
            if (!this.isCaseEmpty(charInBox)) {
                if (!this.isLetterOnBoardTheSame(charInBox, letter)) {
                    throw new ImpossibleCommand("Il y a déjà une lettre dans l'une des cases ciblées.");
                }
                lettersUsedOnBoard.push({ letter, coord: { y, x } });
            } else if (!this.rackService.isLetterOnRack(letter)) {
                throw new ImpossibleCommand('Il y a des lettres qui ne sont ni sur le plateau de jeu, ni sur le chevalet');
            }
        }

        return lettersUsedOnBoard;
    }

    normalizeWord(wordToProcess: string): string {
        const word = wordToProcess.normalize('NFD').replace(/\p{Diacritic}/gu, '');
        return word;
    }

    checkAllWordsExist(word: string, coord: Vec2): { wordExists: boolean; errorMessage: string } {
        if (this.isFirstMove()) {
            if (word.length < 2) {
                return {
                    wordExists: false,
                    errorMessage: `il vous faut former des mots d'une longueur minimale de 2, mais le mot ${word} a une longueur de 1.`,
                };
            }
        }
        let wordFound = '';
        let i = 0;

        while (i < word.length && coord.y + i < SQUARE_NUMBER) {
            wordFound = this.findHorizontalAdjacentWord({ x: coord.x, y: coord.y + i });
            i++;
            if (wordFound.length >= 2) {
                if (!this.isWordInDictionary(wordFound)) {
                    return { wordExists: false, errorMessage: `le mot ${wordFound} n'existe pas dans le dictionnaire` };
                }
            }
        }
        i = 0;
        while (i < word.length && coord.x + i < SQUARE_NUMBER) {
            wordFound = this.findVerticalAdjacentWord({ x: coord.x + i, y: coord.y });
            i++;
            if (wordFound.length >= 2) {
                if (!this.isWordInDictionary(wordFound)) {
                    return { wordExists: false, errorMessage: `le mot ${wordFound} n'existe pas dans le dictionnaire` };
                }
            }
        }

        return { wordExists: true, errorMessage: '' };
    }

    computeCoordByDirection(direction: string, coord: Vec2, step: number): Vec2 {
        const x = direction === 'h' || direction === 'horizontal' ? coord.x + step : coord.x;
        const y = direction === 'v' || direction === 'vertical' ? coord.y + step : coord.y;

        return { y, x };
    }
    isWordInDictionary(wordToCheck: string): boolean {
        return this.dictionary.words.includes(wordToCheck.toLowerCase());
    }

    validatePlaceFeasibility(word: string, coord: Vec2, direction: string): { letter: string; coord: Vec2 }[] {
        if (this.isFirstMove()) {
            this.validateFirstMove(word, direction, coord);
        } else {
            if (!this.hasAdjacent(word, coord, direction)) {
                throw new ImpossibleCommand('Vous devez placer un mot ayant au moins une lettre adjacente aux lettres du plateau de jeu.');
            }
        }
        this.validateInvalidSymbols(word);
        this.validateJokersOccurrencesMatch(word);
        const lettersUsedOnBoard = this.isFitting(coord, direction, word);
        return lettersUsedOnBoard;
    }
    isFirstMove(): boolean {
        const h8Coord: Vec2 = { x: 7, y: 7 };
        return tiles[h8Coord.x][h8Coord.y].letter === '';
    }

    private findVerticalAdjacentWord(coord: Vec2): string {
        let up = coord.y;
        let down = coord.y;
        let wordFound = '';

        if (this.bonuses.includes(tiles[coord.y][coord.x].text)) {
            return wordFound;
        }

        while (up > 0 && tiles[up - 1][coord.x].text !== '' && !this.bonuses.includes(tiles[up - 1][coord.x].text)) {
            up--;
        }
        while (down < SQUARE_NUMBER - 1 && tiles[down + 1][coord.x].text !== '' && !this.bonuses.includes(tiles[down + 1][coord.x].text)) {
            down++;
        }

        for (let i = up; i <= down; i++) {
            wordFound += tiles[i][coord.x].text;
        }

        if (this.bonuses.includes(wordFound)) {
            wordFound = '';
        }
        return wordFound;
    }

    private findHorizontalAdjacentWord(coord: Vec2): string {
        let right = coord.x;
        let left = coord.x;
        let wordFound = '';

        if (this.bonuses.includes(tiles[coord.y][coord.x].text)) {
            return wordFound;
        }

        while (left > 0 && tiles[coord.y][left - 1].text !== '' && !this.bonuses.includes(tiles[coord.y][left - 1].text)) {
            left--;
        }
        while (right < SQUARE_NUMBER - 1 && tiles[coord.y][right + 1].text !== '' && !this.bonuses.includes(tiles[coord.y][right + 1].text)) {
            right++;
        }
        for (let i = left; i <= right; i++) {
            wordFound += tiles[coord.y][i].text;
        }
        if (this.bonuses.includes(wordFound)) {
            wordFound = '';
        }
        return wordFound;
    }

    private hasAdjacent(word: string, coord: Vec2, direction: string): boolean {
        for (let i = 0; i < word.length; i++) {
            const computedCoord = this.computeCoordByDirection(direction, coord, i);
            const x = computedCoord.x;
            const y = computedCoord.y;
            if (
                !this.isCaseEmpty(tiles[coord.y][coord.x].letter) ||
                this.findAdjacentUp({ y, x }) ||
                this.findAdjacentLeft({ y, x }) ||
                this.findAdjacentRight({ y, x }) ||
                this.findAdjacentDown({ y, x })
            ) {
                return true;
            }
        }
        return false;
    }

    private findAdjacentUp(coord: Vec2): boolean {
        if (coord.x > 0) {
            return tiles[coord.x - 1][coord.y].letter !== '';
        }
        return false;
    }

    private findAdjacentDown(coord: Vec2) {
        if (coord.x < SQUARE_NUMBER - 1) {
            return tiles[coord.x + 1][coord.y].letter !== '';
        }
        return false;
    }

    private findAdjacentRight(coord: Vec2) {
        if (coord.y < SQUARE_NUMBER - 1) {
            return tiles[coord.x][coord.y + 1].letter !== '';
        }
        return false;
    }

    private findAdjacentLeft(coord: Vec2) {
        if (coord.y > 0) {
            return tiles[coord.x][coord.y - 1].letter !== '';
        }
        return false;
    }

    private isCaseEmpty(letterOnBoard: string): boolean {
        return letterOnBoard === '';
    }

    private isLetterOnBoardTheSame(letterOnBoard: string, letterToPlace: string): boolean {
        return letterOnBoard === letterToPlace;
    }

    private validateJokersOccurrencesMatch(word: string): void {
        const wordToChange = word.split('') as string[];
        const upperLettersInWord: string[] = wordToChange.filter((letter) => letter === letter.toUpperCase());

        const jokersNumb = this.rackService.findJokersNumberOnRack();

        if (upperLettersInWord.length > jokersNumb) {
            throw new NotEnoughOccurrences(` * (lettres blanches) représentant les lettres "${upperLettersInWord.join('", "')}" demandées.`);
        }
    }

    private validateFirstMove(word: string, direction: string, coord: Vec2): void {
        const h8Coord: Vec2 = { x: 7, y: 7 };
        const valid =
            direction === 'h'
                ? coord.x === h8Coord.x && coord.y <= h8Coord.y && coord.y + word.length > h8Coord.y
                : coord.y === h8Coord.y && coord.x <= h8Coord.x && coord.x + word.length > h8Coord.x;
        if (!valid) {
            throw new ImpossibleCommand(' Ceci est votre premier tour, au moins une de vos lettres doit être placée sur la case H8');
        }
    }

    private validateInvalidSymbols(word: string): void {
        const invalid = this.invalidSymbols.some((symbol) => word.includes(symbol));
        if (invalid) {
            throw new CommandSyntaxError("Les symboles (-) et (') sont invalides.");
        }
    }
}
