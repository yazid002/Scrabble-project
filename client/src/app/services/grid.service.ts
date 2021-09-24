import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { CaseStyle } from '@app/classes/case-style';
import { NotEnoughOccurrences } from '@app/classes/command-errors/exchange-errors/not-enough-occurrences';
import { Point } from '@app/classes/point';
import { PosChars } from '@app/classes/pos-chars';
import { Vec2 } from '@app/classes/vec2';
import { Direction, ICaracter } from '@app/models/lettre.model';
import { VerifyService } from '@app/verify.service';
// import { ReserveService } from './reserve.service';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';
import { WordValidationService } from './word-validation.service';

// TODO : Avoir un fichier séparé pour les constantes et ne pas les répéter!
export const DEFAULT_WIDTH = 500;
export const DEFAULT_HEIGHT = 500;
const SQUARE_NUMBER = 15;
const SQUARE_WIDTH = DEFAULT_WIDTH / SQUARE_NUMBER;
const SQUARE_HEIGHT = DEFAULT_HEIGHT / SQUARE_NUMBER;
const tile: CaseStyle = { color: 'DarkGoldenRod', font: '25px serif' };
// const DL_COLOR = 'rgba(0, 0, 200, 0.45)';
const TL_COLOR = 'rgba(200, 0, 0, 0.45)';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    gridContext: CanvasRenderingContext2D;

    private canvasSize: Vec2 = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(
        private rack: RackService,
        private verifyService: VerifyService,
        private reserveService: ReserveService,
        private dictionaryService: WordValidationService,
    ) {}

    // TODO : pas de valeurs magiques!! Faudrait avoir une meilleure manière de le faire
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    fillGridText(text: string, x: number, y: number): void {
        this.gridContext.fillStyle = 'rgb(200,200,200)';
        this.gridContext.font = '15px serif';
        this.gridContext.strokeText(text, SQUARE_WIDTH * x + 7, SQUARE_HEIGHT * y + 22);
    }

    fillGrid(xPos: number, yPos: number, text: string): void {
        this.gridContext.fillRect(xPos * SQUARE_WIDTH, yPos * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
        this.fillGridText(text, xPos, yPos);
    }
    drawGrid() {
        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 1;
        this.gridContext.fillStyle = 'rgb(245, 241, 222)';
        this.gridContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                switch (tiles[y][x].bonus) {
                    case 'TW':
                        this.gridContext.fillStyle = tiles[y][x].style.color;
                        this.fillGrid(x, y, tiles[y][x].text);
                        break;
                    case 'DL':
                        this.gridContext.fillStyle = tiles[y][x].style.color;
                        this.fillGrid(x, y, tiles[y][x].text);

                        break;
                    case 'DW':
                        this.gridContext.fillStyle = tiles[y][x].style.color;
                        this.fillGrid(x, y, tiles[y][x].text);

                        break;
                    case 'TL':
                        this.gridContext.fillStyle = TL_COLOR;
                        this.fillGrid(x, y, tiles[y][x].text);

                        break;
                    case 'xx':
                        this.gridContext.fillStyle = tiles[y][x].style.color;
                        this.fillGrid(x, y, tiles[y][x].text);

                        break;
                }
                this.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
            }
        }
        this.gridContext.fillStyle = '#FFE4C4';
        this.gridContext.fillRect(0, DEFAULT_WIDTH, SQUARE_HEIGHT * 16, SQUARE_WIDTH * 16);
        this.gridContext.fillRect(DEFAULT_HEIGHT, 0, SQUARE_HEIGHT * 16, SQUARE_WIDTH * 16);

        this.gridContext.fillStyle = 'rgb(0,0,0)';
        this.gridContext.font = '30px serif';

        for (let i = 0; i < 15; i++) {
            const pas = i + 1;
            const pas2 = i + 65;

            if (pas < 10) {
                // this.gridContext.fillStyle = '#FFF0F5';
                //     this.gridContext.fillRect(0, DEFAULT_WIDTH, SQUARE_HEIGHT * 16, SQUARE_WIDTH * 16);
                // this.gridContext.fillRect(DEFAULT_HEIGHT, 0, SQUARE_HEIGHT * 16, SQUARE_WIDTH * 16);
                this.gridContext.fillText(pas.toString(), SQUARE_WIDTH * i + 10, SQUARE_HEIGHT * 16 - 6);
            } else {
                this.gridContext.fillText(pas.toString(), SQUARE_WIDTH * i, SQUARE_HEIGHT * 16 - 6);
            }
            this.gridContext.fillText(String.fromCharCode(pas2), SQUARE_WIDTH * 15 + 5, SQUARE_HEIGHT * i + 28);
        }
    }

    drawWord(word: string) {
        const startPosition: Vec2 = { x: 175, y: 100 };

        const step = 20;
        this.gridContext.font = '20px system-ui';
        for (let i = 0; i < word.length; i++) {
            this.gridContext.fillText(word[i], startPosition.x + step * i, startPosition.y);
        }
    }

    fillRackPortion(line: number, colone: number, letter: string, style: CaseStyle) {
        this.gridContext.clearRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * colone,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * line,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        console.log(letter);
        // this.gridContext.rect(33.33 * 4, 33.33 * 0, 33.33, 33.33);

        this.gridContext.beginPath();
        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 1;
        this.gridContext.fillStyle = style.color;

        this.gridContext.fillRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * colone,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * line,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.gridContext.strokeRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * colone,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * line,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        // this.gridContext.stroke();
        this.gridContext.fillStyle = 'rgb(0,0,0)';
        this.gridContext.font = style.font;
        this.gridContext.strokeText(letter, (DEFAULT_WIDTH / SQUARE_NUMBER) * colone + 7, (DEFAULT_WIDTH / SQUARE_NUMBER) * line  + 22);

        // this.fillGridText(letter, (DEFAULT_WIDTH / SQUARE_NUMBER) * (colone - 1) + 6, (DEFAULT_WIDTH / SQUARE_NUMBER) * (line + 1) - 3.33);

        this.gridContext.stroke();

        // eslint-disable-next-line no-console
        // eslint-disable-next-line no-console

        // this.gridContext.font = '10px serif';

        // tiles[colone][line].letter = letter.affiche;
    }

    IsplacingWordValid(word: string, position: string, x: number, y: number) {
        this.placeWord(word, position, x, y);
        console.log('tiles ancien', tiles);

        if (!this.dictionaryService.checkWordExists(word) || !this.dictionaryService.checkWordMinLength(2, word)) {
            for (let i = 0; i < word.length; i++) {
                const newX = position === 'h' ? x : x + i;
                const newY = position === 'v' ? y - 1 : y + i - 1;

                tiles[newX][newY].text = tiles[newX][newY].oldText;
                tiles[newX][newY].style = tiles[newX][newY].oldStyle;
                console.log('nouv ancien', tiles[newX][newY].text, tiles[newX][newY].oldText);

                this.fillRackPortion(newX, newY, tiles[newX][newY].text.toUpperCase(), tiles[newX][newY].style);
                console.log('tiles new', tiles);
            }
        }
        this.rack.replaceWord(word);
    }

    placeWord(word: string, positions: string, x: number, y: number) {
        const posWord = new PosChars(word, new Point(x, y));

        this.validatePlaceFeasibility(posWord, positions);
        // if (positions === 'h') {
        //     this.writeWordH(word, x, y);
        // } else {
        //     this.writeWordV(word, x, y);
        // }
        this.writeWord(word, x, y, positions);

        //   const dir = positions === 'h' ? Direction.RIGHT : Direction.BOTTOM;

        console.log(tiles);
        // if (!this.verifyService.verifyAllWords(posWord.position as Point, dir, word)) {
        //     throw new CommandError("Ce mot n'existe pas dans le dictionnaire");
        // }
        // this.rack.replaceWord(word);
    }

    writeWord(word: string, x: number, y: number, position: string) {
        // maison

        let newX: number;
        let newY: number;

        for (let i = 0; i < word.length; i++) {
            newX = position === 'h' ? x : x + i;
            newY = position === 'v' ? y - 1 : y + i - 1;
            const character = this.reserveService.findLetter(word[i]) as ICaracter;

            if (word[i] === word[i].toUpperCase()) {
                if (character.name === '*') {
                    character.affiche = word[i];
                }
            }
            tiles[newX][newY].letter = word[i].toLowerCase();

            // this.fillGrid(x,y, tiles[y][x].text);
            // this.fillGridText(tiles[x][y - 1 + i].text, x, y);

            tiles[newX][newY].oldStyle = tiles[newX][newY].style;
            tiles[newX][newY].style = tile;

            tiles[newX][newY].oldText = tiles[newX][newY].text;
            tiles[newX][newY].text = word[i].toUpperCase();
            console.log('nouv ancien', tiles[newX][newY].text, tiles[newX][newY].oldText);

            this.fillRackPortion(newX, newY, tiles[newX][newY].text, tiles[newX][newY].style);

            console.log('aloooooo', tiles);
        }
        // this.rack.replaceWord(word);
    }

    // writeWordH(word: string, x: number, y: number) {
    //     // maison

    //     for (let i = 0; i < word.length; i++) {
    //         const character = this.reserveService.findLetter(word[i]) as ICaracter;

    //         if (word[i] === word[i].toUpperCase()) {
    //             if (character.name === '*') {
    //                 character.affiche = word[i];
    //             }
    //         }
    //         tiles[x][y + i].letter = word[i].toLowerCase();
    //         // this.fillGrid(x,y, tiles[y][x].text);
    //         // this.fillGridText(tiles[x][y - 1 + i].text, x, y);
    //         tiles[x][y + i].oldText = tiles[x][y + i].text;
    //         tiles[x][y + i].text = word[i].toUpperCase();

    //         this.fillRackPortion(x, y + i, tiles[x][y + i].text,);

    //         console.log('aloooooo', tiles);
    //     }
    //     // this.rack.replaceWord(word);
    // }

    writeWordV(word: string, x: number, y: number) {
        // maison

        for (let i = 0; i < word.length; i++) {
            const character = this.reserveService.findLetter(word[i]) as ICaracter;

            if (word[i] === word[i].toUpperCase()) {
                if (character.name === '*') {
                    character.affiche = word[i];
                }
            }
            // this.fillRackPortion(x + i, y, character);
            // const letter = word[i];
            // // if (word[i] === word[i].toUpperCase()) {
            // //     letter
            // // }
            tiles[x + i][y - 1].letter = word[i].toLowerCase();
        }
        // this.rack.replaceWord(word);
    }

    storeGridData(word: string, x: number, y: number) {
        const currentText: string[] = [''];
        currentText.length = word.length - 1;

        console.log(tiles[y + 1][x + 1].text);

        // for (const i: number of word) {
        //     for (const j: number of word) {
        currentText.push(tiles[y][x].text);
        console.log('size', currentText.length);

        console.log('inside tab', currentText);

        return currentText;
    }

    private validatePlaceFeasibility(posChar: PosChars, positions: string): void {
        const wordToChange = posChar.lettre?.split('') as string[];
        // const inexistentLettersOnRack: string[] = this.rack
        //     .findInexistentLettersOnRack(wordToChange)
        //     .filter((letter) => letter === letter.toLowerCase());
        const upperLettersInWord: string[] = wordToChange.filter((letter) => letter === letter.toUpperCase());
        // const upperLettersInWord: string[] = wordToChange.filter((letter) => letter === letter.toUpperCase());
        console.log(upperLettersInWord);
        const jokersNumb = this.rack.findJokerOnRack();
        console.log(jokersNumb);

        if (upperLettersInWord.length > jokersNumb) {
            throw new NotEnoughOccurrences(`suivantes ${upperLettersInWord.join(', ')} représentées par des *.`);
        }
        const dir = positions === 'h' ? Direction.RIGHT : Direction.BOTTOM;
        console.log('isFiting: ', this.verifyService.isFiting(posChar.position as Point, dir, posChar.lettre as string));
        console.log('isWORDONRACK: ', this.rack.findWordOnRack(posChar.lettre?.split('') as string[]));
        // if (
        //     !(
        //         !this.verifyService.isAllValid(posChar.position as Point, dir, posChar.lettre as string) &&
        //         this.rack.findWordOnRack(posChar.lettre?.split('') as string[])
        //     )
        // ) {
        //     throw new CommandError('Il y a des lettres qui ne sont ni sur le plateau de jeu, ni sur le chevalet');
        //     // throw new CommandError('Il y a des erreurs par rapport aux règles du scrabble');
        // }

        // if (!this.verifyService.isFiting(posChar.position as Point, dir, posChar.lettre as string)) {
        //     console.log('je suis pas valide');
        //     // if (!this.rack.findWordOnRack(posChar.lettre?.split('') as string[])) {
        //     //     throw new CommandError('Il y a des lettres qui ne sont ni sur le plateau de jeu, ni sur le chevalet');
        //     // }
        //     throw new CommandError('Il y a des lettres qui ne sont ni sur le plateau de jeu, ni sur le chevalet');
        // }
        this.verifyService.isFiting(posChar.position as Point, dir, posChar.lettre as string);
        // if (!this.dictionaryService.checkWordExists(posChar.lettre as string)) {
        //     throw new CommandError("Ce mot n'existe pas dans le dictionnaire");
        // }

        //  for()

        // if (inexistentLettersOnRack.length) {
        //     throw new InexistentLettersOnRack(`${inexistentLettersOnRack.join(', ')}.`);
        // }

        //   if(!this.verifyService.isAllValid(posChar.position as Point, dir, posChar.lettre as string) && )
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
