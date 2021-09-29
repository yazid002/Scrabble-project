import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { CaseStyle } from '@app/classes/case-style';
import { CommandSyntaxError } from '@app/classes/command-errors/command-syntax-errors/command-syntax-error';
import { NotEnoughOccurrences } from '@app/classes/command-errors/command-syntax-errors/not-enough-occurrences';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { ICharacter as ICharacter } from '@app/classes/letter';
import { Point } from '@app/classes/point';
import { PosChars } from '@app/classes/pos-chars';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, SQUARE_HEIGHT, SQUARE_NUMBER, SQUARE_WIDTH, TILE as TILE_STYLE } from '@app/constants/board-constants';
import { Direction } from '@app/enums/letter-enums';
import { RackService } from '@app/services/rack.service';
import { ReserveService } from '@app/services/reserve.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { VerifyService } from '@app/verify.service';

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

    drawGridOutdoor() {
        this.changeGridStyle('PeachPuff');
        this.gridContext.fillRect(0, DEFAULT_WIDTH, SQUARE_HEIGHT * (SQUARE_NUMBER + 1), SQUARE_WIDTH * (SQUARE_NUMBER + 1));
        this.gridContext.fillRect(DEFAULT_HEIGHT, 0, SQUARE_HEIGHT * (SQUARE_NUMBER + 1), SQUARE_WIDTH * (SQUARE_NUMBER + 1));

        this.changeGridStyle('black', '30px serif');

        for (let i = 0; i < SQUARE_NUMBER; i++) {
            const NUMBERS_STEP = i + 1;
            const LETTERS_STEP = i + 'A'.charCodeAt(0);
            const NUMBERS_PIXELS_HEIGH_ADJUSTMENT = 6;
            const LETTERS_PIXELS_WIDTH_ADJUSTMENT = 5;
            const LETTERS_PIXELS_HEIGH_ADJUSTMENT = 28;
            const NUMBERS_STEP_MAX = 10;

            if (NUMBERS_STEP < NUMBERS_STEP_MAX) {
                this.gridContext.fillText(
                    NUMBERS_STEP.toString(),
                    SQUARE_WIDTH * i + NUMBERS_STEP_MAX,
                    SQUARE_HEIGHT * (SQUARE_NUMBER + 1) - NUMBERS_PIXELS_HEIGH_ADJUSTMENT,
                );
            } else {
                this.gridContext.fillText(
                    NUMBERS_STEP.toString(),
                    SQUARE_WIDTH * i,
                    SQUARE_HEIGHT * (SQUARE_NUMBER + 1) - NUMBERS_PIXELS_HEIGH_ADJUSTMENT,
                );
            }
            this.gridContext.fillText(
                String.fromCharCode(LETTERS_STEP),
                SQUARE_WIDTH * SQUARE_NUMBER + LETTERS_PIXELS_WIDTH_ADJUSTMENT,
                SQUARE_HEIGHT * i + LETTERS_PIXELS_HEIGH_ADJUSTMENT,
            );
        }
    }

    drawGrid() {
        this.gridContext.beginPath();
        this.changeGridStyle('rgb(245, 241, 222)', undefined, 'black', 1);
        this.gridContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                this.fillGridPortion({ x, y }, tiles[y][x].text, tiles[y][x].style);
                this.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
            }
        }

        this.drawGridOutdoor();
    }

    fillGridPortion(coord: Vec2, letter: string, style: CaseStyle) {
        const LETTERS_PIXELS_WIDTH_ADJUSTMENT = 7;
        const LETTERS_PIXELS_HEIGH_ADJUSTMENT = 22;
        this.gridContext.clearRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.changeGridStyle(style.color, undefined, 'black', 1);

        this.gridContext.fillRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.gridContext.strokeRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.changeGridStyle('black', style.font);
        this.gridContext.strokeText(
            letter,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + LETTERS_PIXELS_WIDTH_ADJUSTMENT,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + LETTERS_PIXELS_HEIGH_ADJUSTMENT,
        );

        this.gridContext.stroke();
    }

    changeGridStyle(fillStyle?: string, font?: string, strokeStyle?: string, lineWidth?: number): void {
        this.gridContext.fillStyle = fillStyle as string;
        this.gridContext.font = font as string;
        this.gridContext.strokeStyle = strokeStyle as string;
        this.gridContext.lineWidth = lineWidth as number;
    }

    async placeWord(word: string, coord: Vec2, direction: string): Promise<void> {
        word = this.dictionaryService.normalizeWord(word);

        const promise = new Promise<void>((resolve, reject) => {
            const posWord = new PosChars(word, new Point(coord.x, coord.y));

            this.validatePlaceFeasibility(posWord, direction);
            this.writeWord(word, coord, direction);

            if (!this.dictionaryService.checkWordExists(word) || !this.dictionaryService.checkWordMinLength(2, word)) {
                const PLACEMENT_DURATION = 3000; // 3000 millisecondes soit 3s;
                for (let i = 0; i < word.length; i++) {
                    const x = this.computeCoordByDirection(direction, coord, i).x;
                    const y = this.computeCoordByDirection(direction, coord, i).y;

                    tiles[x][y].text = tiles[x][y].oldText;
                    tiles[x][y].style = tiles[x][y].oldStyle;
                    setTimeout(() => {
                        this.fillGridPortion({ x, y }, tiles[x][y].text.toUpperCase(), tiles[x][y].style);
                    }, PLACEMENT_DURATION);
                }

                reject(new ImpossibleCommand("Ce mot n'existe pas dans le dictionnaire"));
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

    writeWord(word: string, coord: Vec2, direction: string) {
        for (let i = 0; i < word.length; i++) {
            const x = this.computeCoordByDirection(direction, coord, i).x;
            const y = this.computeCoordByDirection(direction, coord, i).y;
            const character = this.reserveService.findLetterInReserve(word[i]) as ICharacter;

            if (word[i] === word[i].toUpperCase()) {
                if (character.name === '*') {
                    character.affiche = word[i];
                }
            }

            tiles[x][y].oldStyle = tiles[x][y].style;
            tiles[x][y].style = TILE_STYLE;

            tiles[x][y].oldText = tiles[x][y].text;
            tiles[x][y].text = word[i].toUpperCase();

            this.fillGridPortion({ x, y }, tiles[x][y].text, tiles[x][y].style);
        }
    }

    private validatePlaceFeasibility(posChar: PosChars, positions: string): void {
        if (this.isFirstMoveValid()) {
            this.validateFirstMove(posChar.letter as string, positions, {
                x: posChar.position?.row as number,
                y: posChar.position?.column as number,
            });
        }
        this.validateInvalidSymbols(posChar.letter as string);
        this.validateJokersOccurrencesMatch(posChar.letter as string);
        const dir = positions === 'h' ? Direction.RIGHT : Direction.BOTTOM;
        this.verifyService.isFiting(posChar.position as Point, dir, posChar.letter as string);
    }

    private validateJokersOccurrencesMatch(word: string): void {
        const wordToChange = word.split('') as string[];
        const upperLettersInWord: string[] = wordToChange.filter((letter) => letter === letter.toUpperCase());
        const jokersNumb = this.rack.findJokersNumberOnRack();

        if (upperLettersInWord.length > jokersNumb) {
            throw new NotEnoughOccurrences(` * (lettres blanches) pour représenter les lettres "${upperLettersInWord.join('", "')}" demandées.`);
        }
    }

    private validateFirstMove(word: string, direction: string, coord: Vec2): void {
        const H8_COORD: Vec2 = { x: 7, y: 7 };
        if (direction === 'h') {
            if (!(coord.x === H8_COORD.x && coord.y <= H8_COORD.y && coord.y + word.length > H8_COORD.y)) {
                throw new ImpossibleCommand(' Ceci est votre premier tour, au moins une de vos lettres doit être placée sur la case H8');
            }
        }
        if (direction === 'v') {
            if (!(coord.y === H8_COORD.y && coord.x <= H8_COORD.x && coord.x + word.length > H8_COORD.x)) {
                throw new ImpossibleCommand(' Ceci est votre premier tour, au moins une de vos lettres doit être placée sur la case H8');
            }
        }
    }

    private isFirstMoveValid(): boolean {
        return tiles[7][7].oldText === '';
    }

    private validateInvalidSymbols(word: string): void {
        if (this.dictionaryService.checkInvalidSymbols(word)) {
            throw new CommandSyntaxError(" Les symboles (-) et (') sont invalides.");
        }
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }
}
