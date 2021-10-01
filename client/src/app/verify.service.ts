import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import * as dictionary from 'src/assets/dictionnary.json';
import { CommandSyntaxError } from './classes/command-errors/command-syntax-errors/command-syntax-error';
import { NotEnoughOccurrences } from './classes/command-errors/command-syntax-errors/not-enough-occurrences';
import { ImpossibleCommand } from './classes/command-errors/impossible-command/impossible-command';
import { Dictionary } from './classes/dictionary';
import { Point } from './classes/point';
import { PosChars } from './classes/pos-chars';
import { Vec2 } from './classes/vec2';
import { SQUARE_NUMBER } from './constants/board-constants';
import { Direction } from './enums/letter-enums';
import { RackService } from './services/rack.service';

@Injectable({
    providedIn: 'root',
})
export class VerifyService {
    dictionary: Dictionary;
    invalidSymbols: string[];
    bonuses: string[];
    constructor(private rackService: RackService) {
        this.dictionary = dictionary as Dictionary;
        this.invalidSymbols = ['-', "'"];
        this.bonuses = ['dl', 'tw', 'tl', 'dw'];
    }

    isFitting(p: Point, dir: Direction, word: string): { letter: string; coord: Vec2 }[] {
        const remainingCases = dir === Direction.BOTTOM ? tiles.length - p.row : tiles.length - p.column;
        if (word.length > remainingCases) {
            throw new ImpossibleCommand("Il n'y a pas assez de place pour écrire ce mot");
        }

        const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];
        for (let i = 0; i < word.length; i++) {
            const direction = dir === Direction.BOTTOM ? 'v' : 'h';
            const x = this.computeCoordByDirection(direction, { x: p.row, y: p.column }, i).x;
            const y = this.computeCoordByDirection(direction, { x: p.row, y: p.column }, i).y;
            const charInBox = tiles[x][y].letter;
            const letter = word.charAt(i) === word.charAt(i).toUpperCase() ? '*' : word.charAt(i);
            if (!this.isCaseEmpty(charInBox)) {
                if (!this.isLetterOnBoardTheSame(charInBox, letter)) {
                    throw new ImpossibleCommand("Il y a déjà une lettre dans l'une des cases ciblées.");
                }
                lettersUsedOnBoard.push({ letter: charInBox, coord: { x, y } });
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
        //   for (let i = 0; i < word.length; ++i) {
        while (i < word.length && coord.y + i < SQUARE_NUMBER) {
            console.log(i);
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
            // for (let i = 0; i < word.length; ++i) {
            console.log(i);
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

    hasAdjacent(word: string, coord: Vec2, direction: string): boolean {
        for (let i = 0; i < word.length; i++) {
            const x = this.computeCoordByDirection(direction, coord, i).x;
            const y = this.computeCoordByDirection(direction, coord, i).y;
            if (
                tiles[coord.x][coord.y].letter !== '' ||
                this.findAdjacentUp({ x, y }) ||
                this.findAdjacentLeft({ x, y }) ||
                this.findAdjacentRight({ x, y }) ||
                this.findAdjacentDown({ x, y })
            ) {
                return true;
            }
        }
        return false;
    }

    computeCoordByDirection(direction: string, coord: Vec2, step: number): Vec2 {
        const x = direction === 'h' ? coord.x : coord.x + step;
        const y = direction === 'v' ? coord.y : coord.y + step;

        return { x, y };
    }

    findAdjacentUp(coord: Vec2): boolean {
        if (coord.x > 0) {
            return tiles[coord.x - 1][coord.y].letter !== '';
        }
        return false;
    }

    findAdjacentDown(coord: Vec2) {
        if (coord.x < SQUARE_NUMBER - 1) {
            return tiles[coord.x + 1][coord.y].letter !== '';
        }
        return false;
    }

    findAdjacentRight(coord: Vec2) {
        if (coord.y < SQUARE_NUMBER - 1) {
            return tiles[coord.x][coord.y + 1].letter !== '';
        }
        return false;
    }

    findAdjacentLeft(coord: Vec2) {
        if (coord.y > 0) {
            return tiles[coord.x][coord.y - 1].letter !== '';
        }
        return false;
    }

    findVerticalAdjacentWord(coord: Vec2): string {
        let up = coord.x;
        let down = coord.x;
        let wordFound = '';
        console.log(coord);
        if (this.bonuses.includes(tiles[coord.x][coord.y].text)) {
            return wordFound;
        }

        while (up > 0 && tiles[up - 1][coord.y].text !== '' && !this.bonuses.includes(tiles[up - 1][coord.y].text)) {
            console.log(up);
            up--;
            console.log(up);
        }
        while (down < SQUARE_NUMBER - 1 && tiles[down + 1][coord.y].text !== '' && !this.bonuses.includes(tiles[down + 1][coord.y].text)) {
            console.log(down);
            down++;
            console.log(down);
        }

        for (let i = up; i <= down; i++) {
            console.log(i);
            console.log(tiles[i][coord.y].text);
            wordFound += tiles[i][coord.y].text;
        }
        console.log(wordFound);
        if (this.bonuses.includes(wordFound)) {
            wordFound = '';
        }
        return wordFound;
    }

    findHorizontalAdjacentWord(coord: Vec2): string {
        let right = coord.y;
        let left = coord.y;
        let wordFound = '';
        console.log(coord);
        if (this.bonuses.includes(tiles[coord.x][coord.y].text)) {
            return wordFound;
        }

        while (left > 0 && tiles[coord.x][left - 1].text !== '' && !this.bonuses.includes(tiles[coord.x][left - 1].text)) {
            console.log(left);
            left--;
            console.log(left);
        }
        while (right < SQUARE_NUMBER - 1 && tiles[coord.x][right + 1].text !== '' && !this.bonuses.includes(tiles[coord.x][right + 1].text)) {
            console.log(right);
            right++;
            console.log(right);
        }
        for (let i = left; i <= right; i++) {
            wordFound += tiles[coord.x][i].text;
        }
        console.log(wordFound);
        if (this.bonuses.includes(wordFound)) {
            wordFound = '';
        }
        return wordFound; // .length > 1 ? wordFound : '';
    }

    validatePlaceFeasibility(posChar: PosChars, direction: string): { letter: string; coord: Vec2 }[] {
        if (this.isFirstMove()) {
            this.validateFirstMove(posChar.letter as string, direction, {
                x: posChar.position?.row as number,
                y: posChar.position?.column as number,
            });
        } else {
            if (
                !this.hasAdjacent(
                    posChar.letter as string,
                    {
                        x: posChar.position?.row as number,
                        y: posChar.position?.column as number,
                    },
                    direction,
                )
            ) {
                throw new ImpossibleCommand('Vous devez placer un mot ayant au moins une lettre adjacente aux lettres du plateau de jeu.');
            }
        }
        this.validateInvalidSymbols(posChar.letter as string);
        this.validateJokersOccurrencesMatch(posChar.letter as string);
        const dir = direction === 'h' ? Direction.RIGHT : Direction.BOTTOM;
        const lettersUsedOnBoard = this.isFitting(posChar.position as Point, dir, posChar.letter as string);
        return lettersUsedOnBoard;
    }

    private checkInvalidSymbols(wordToCheck: string): boolean {
        return this.invalidSymbols.some((symbol) => wordToCheck.includes(symbol));
    }

    private isCaseEmpty(letterToCheck: string): boolean {
        return letterToCheck === '';
    }

    private isLetterOnBoardTheSame(letterToCheck: string, letter: string): boolean {
        return letterToCheck === letter;
    }

    private isWordInDictionary(wordToCheck: string): boolean {
        return this.dictionary.words.includes(wordToCheck.toLowerCase());
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

    private isFirstMove(): boolean {
        const h8Coord: Vec2 = { x: 7, y: 7 };
        return tiles[h8Coord.x][h8Coord.y].letter === '';
    }

    private validateInvalidSymbols(word: string): void {
        if (this.checkInvalidSymbols(word)) {
            throw new CommandSyntaxError(" Les symboles (-) et (') sont invalides.");
        }
    }

    // getWord(p: Point, dir: Direction) {
    //     // eslint-disable-next-line max-len
    //     // positioner les index fromIndex(debut du mot a
    // extraire pour verifier si tjrs dans le dictionnaire) a la position d'une lettre avec l'expression ternaire(not lambda)
    //     // eslint-disable-next-line max-len
    //     // positioner les index toIndex(fin du mot a extraire pour verifier si tjrs
    // dans le dictionnaire) a la position d'une lettre avec l'expression ternaire(not lambda)
    //     // par exemple : CANADA au debut sur C, ensuite sur A, ensuite sur N, ...
    //     // console.log('on est ou ', p.row, p.column);
    //     p.row -= 2;
    //     let fromIndex: number = dir === Direction.BOTTOM ? p.row : p.column;
    //     let toIndex: number = dir === Direction.BOTTOM ? p.row : p.column;
    //     let newWord = ''; // le mot a extraire

    //     // console.log('y a quoi dedans : ', tiles[fromIndex - 2][p.column]);

    //     // reculer fromIndex jusqu'au debut du mot a extraire (jusqu'au un case vide)
    //     if (dir === Direction.BOTTOM) {
    //         while (fromIndex >= 0 && tiles[fromIndex][p.column].letter !== '') {
    //             fromIndex--;
    //         }
    //         // avancer toIndex jusqu'au la fin du mot a extraire (jusqu'au un case vide)
    //         while (toIndex < tiles.length && tiles[toIndex][p.column].letter !== '') {
    //             toIndex++;
    //         }
    //         // puis extraire le mot a tester par concatenation
    //         for (let i = fromIndex; i < toIndex; i++) {
    //             newWord += tiles[i][p.column];
    //         }
    //     }

    //     if (dir === Direction.RIGHT) {
    //         // console.log(p.row, fromIndex);
    //         while (fromIndex >= 0 || tiles[p.row][fromIndex].letter !== '') {
    //             fromIndex--;
    //         }
    //         while (toIndex < tiles.length || tiles[p.row][toIndex].letter !== '') {
    //             toIndex++;
    //         }
    //         for (let i = fromIndex; i <= toIndex; i++) {
    //             newWord += tiles[i][p.column];
    //         }
    //     }
    //     return newWord;
    // }

    // verifyAdjacentLetterExist(p: Point, direction: Direction) {
    //     if (direction === Direction.RIGHT) {
    //         if (tiles[p.row - 1][p.column].letter !== '' || tiles[p.row + 1][p.column].letter !== '') {
    //             return true;
    //         }
    //     }
    //     if (direction === Direction.BOTTOM) {
    //         if (tiles[p.row][p.column - 1].letter !== '' || tiles[p.row][p.column + 1].letter !== '') {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // verifyAllWords(p: Point, dir: Direction, word: string) {
    //     //  p.column -= 2;
    //     // console.log('la direction est ', dir.toString());
    //     if (dir === Direction.RIGHT) {
    //         // console.log('je suis dans le if');
    //         // console.log('p :', p.row, p.column);
    //         for (let i = p.column; i <= p.column + word.length; i++) {
    //             // console.log('je suis dans le for');
    //             const newPoint = new Point(p.row, i);
    //             // console.log('dans dico?: ', this.dictionaryService.checkWordExists(this.getWord(newPoint, dir)));
    //             //  const theWord = this.getWord(newPoint, dir);

    //             // console.log('le mot :', theWord);
    //             // console.log('exist :', this.dictionaryService.checkWordExists(theWord));
    //             if (!this.dictionaryService.checkWordExists(this.getWord(newPoint, dir)) && !this.verifyAdjacentLetterExist(p, dir)) {
    //                 return false;
    //             }
    //         }
    //     }
    //     if (dir === Direction.BOTTOM) {
    //         for (let i = p.row; i <= word.length; i++) {
    //             const newPoint = new Point(i, p.column);

    //             // console.log('dans dico?: ', this.dictionaryService.checkWordExists(this.getWord(newPoint, dir)));
    //             // const theWord = this.getWord(newPoint, dir);

    //             // console.log('le mot :', theWord);
    //             // console.log('exist :', this.dictionaryService.checkWordExists(theWord));

    //             if (!this.dictionaryService.checkWordExists(this.getWord(newPoint, dir)) && !this.verifyAdjacentLetterExist(p, dir)) {
    //                 return false;
    //             }
    //         }
    //     }
    //     return true;
    // }

    // isAllValid(p: Point, dir: Direction, word: string) {
    //     // if (this.isFiting(p, dir, word) && this.verifyAllWords(p, dir, word)) {
    //     //     return true;
    //     // } else {
    //     //     return false;
    //     // }
    //     // console.log('isFitting: ', this.isFiting(p, dir, word));
    //     // console.log('verifyWord: ', this.verifyAllWords(p, dir, word));
    //     return this.isFitting(p, dir, word);
    //     // && this.verifyAllWords(p, dir, word);
    // }
}
