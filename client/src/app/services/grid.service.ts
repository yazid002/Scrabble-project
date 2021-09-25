import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { CaseStyle } from '@app/classes/case-style';
import { CommandError } from '@app/classes/command-errors/command-error';
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
const tile: CaseStyle = { color: 'NavajoWhite', font: '25px serif' };

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

    drawGridOutdoor() {
        this.gridContext.fillStyle = 'PeachPuff';
        this.gridContext.fillRect(0, DEFAULT_WIDTH, SQUARE_HEIGHT * 16, SQUARE_WIDTH * 16);
        this.gridContext.fillRect(DEFAULT_HEIGHT, 0, SQUARE_HEIGHT * 16, SQUARE_WIDTH * 16);

        this.gridContext.fillStyle = 'rgb(0,0,0)';
        this.gridContext.font = '30px serif';

        for (let i = 0; i < 15; i++) {
            const pas = i + 1;
            const pas2 = i + 65;

            if (pas < 10) {
                this.gridContext.fillText(pas.toString(), SQUARE_WIDTH * i + 10, SQUARE_HEIGHT * 16 - 6);
            } else {
                this.gridContext.fillText(pas.toString(), SQUARE_WIDTH * i, SQUARE_HEIGHT * 16 - 6);
            }
            this.gridContext.fillText(String.fromCharCode(pas2), SQUARE_WIDTH * 15 + 5, SQUARE_HEIGHT * i + 28);
        }
    }

    fillGrid(x: number, y: number, text: string): void {
        this.gridContext.fillRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
        this.gridContext.fillStyle = 'rgb(200,200,200)';
        this.gridContext.font = '15px serif';
        this.gridContext.strokeText(text, SQUARE_WIDTH * x + 7, SQUARE_HEIGHT * y + 22);
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
                        this.gridContext.fillStyle = tiles[y][x].style.color;
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

        this.drawGridOutdoor();
    }

    fillGridPortion(line: number, column: number, letter: string, style: CaseStyle) {
        this.gridContext.clearRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * column,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * line,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.gridContext.strokeStyle = 'black';
        this.gridContext.lineWidth = 1;
        this.gridContext.fillStyle = style.color;

        this.gridContext.fillRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * column,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * line,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.gridContext.strokeRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * column,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * line,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.gridContext.fillStyle = 'rgb(0,0,0)';
        this.gridContext.font = style.font;
        this.gridContext.strokeText(letter, (DEFAULT_WIDTH / SQUARE_NUMBER) * column + 7, (DEFAULT_WIDTH / SQUARE_NUMBER) * line + 22);

        this.gridContext.stroke();
    }

    async isPlacingWordValid(word: string, coord: Vec2, direction: string): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            this.placeWord(word, coord, direction);
            if (!this.dictionaryService.checkWordExists(word) || !this.dictionaryService.checkWordMinLength(2, word)) {
                for (let i = 0; i < word.length; i++) {
                    const x = this.computeCoordByDirection(direction, coord, i).x;
                    const y = this.computeCoordByDirection(direction, coord, i).y;

                    tiles[x][y].text = tiles[x][y].oldText;
                    tiles[x][y].style = tiles[x][y].oldStyle;
                    setTimeout(() => {
                        this.fillGridPortion(x, y, tiles[x][y].text.toUpperCase(), tiles[x][y].style);
                    }, 3000);
                }

                reject(new CommandError("Ce mot n'existe pas dans le dictionnaire"));
            } else {
                this.updateTilesLetters(word, coord, direction);
                resolve(this.rack.replaceWord(word));
            }
        });
        return promise;
    }

    computeCoordByDirection(direction: string, coord: Vec2, step: number): Vec2 {
        const x = direction === 'h' ? coord.x : coord.x + step;
        const y = direction === 'v' ? coord.y : coord.y + step;

        return { x, y };
    }

    updateTilesLetters(word: string, coord: Vec2, direction: string): void {
        for (let i = 0; i < word.length; i++) {
            const x = this.computeCoordByDirection(direction, coord, i).x;
            const y = this.computeCoordByDirection(direction, coord, i).y;
            tiles[x][y].letter = word[i].toLowerCase();
        }
    }

    placeWord(word: string, coord: Vec2, direction: string) {
        const posWord = new PosChars(word, new Point(coord.x, coord.y));

        this.validatePlaceFeasibility(posWord, direction);

        this.writeWord(word, coord, direction);
    }

    writeWord(word: string, coord: Vec2, direction: string) {
        for (let i = 0; i < word.length; i++) {
            const x = this.computeCoordByDirection(direction, coord, i).x;
            const y = this.computeCoordByDirection(direction, coord, i).y;
            const character = this.reserveService.findLetter(word[i]) as ICaracter;

            if (word[i] === word[i].toUpperCase()) {
                if (character.name === '*') {
                    character.affiche = word[i];
                }
            }

            tiles[x][y].oldStyle = tiles[x][y].style;
            tiles[x][y].style = tile;

            tiles[x][y].oldText = tiles[x][y].text;
            tiles[x][y].text = word[i].toUpperCase();

            this.fillGridPortion(x, y, tiles[x][y].text, tiles[x][y].style);
        }
    }
    private validatePlaceFeasibility(posChar: PosChars, positions: string): void {
        const wordToChange = posChar.lettre?.split('') as string[];
        const upperLettersInWord: string[] = wordToChange.filter((letter) => letter === letter.toUpperCase());
        // const upperLettersInWord: string[] = wordToChange.filter((letter) => letter === letter.toUpperCase());
        const jokersNumb = this.rack.findJokerOnRack();

        if (upperLettersInWord.length > jokersNumb) {
            throw new NotEnoughOccurrences(`suivantes ${upperLettersInWord.join(', ')} représentées par des *.`);
        }
        const dir = positions === 'h' ? Direction.RIGHT : Direction.BOTTOM;

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
