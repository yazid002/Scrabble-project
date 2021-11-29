import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Case } from '@app/classes/case';
import { CaseStyle } from '@app/classes/case-style';
import { ICharacter as ICharacter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { BONUSES, DEFAULT_HEIGHT, DEFAULT_WIDTH, SQUARE_HEIGHT, SQUARE_NUMBER, SQUARE_WIDTH } from '@app/constants/board-constants';
import { NOT_FOUND } from '@app/constants/common-constants';
import { ReserveService } from '@app/services/reserve.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    letterStyle: CaseStyle;
    pointStyle: CaseStyle;
    squareColor: string;
    border: CaseStyle;
    squareLineWidth: number;

    gridContext: CanvasRenderingContext2D;
    tiles: Case[][];

    constructor(private reserveService: ReserveService) {
        this.tiles = tiles;
        this.letterStyle = { color: 'NavajoWhite', font: '15px serif' };
        this.pointStyle = { color: 'NavajoWhite', font: '10px serif' };
        this.squareColor = 'black';
        this.border = { squareBorderColor: 'black' };
        this.squareLineWidth = 1;
    }

    writeLetter(letter: string, coord: Vec2): void {
        this.tiles[coord.y][coord.x].oldStyle.color = this.tiles[coord.y][coord.x].style.color;
        this.tiles[coord.y][coord.x].oldStyle.font = this.tiles[coord.y][coord.x].style.font;

        this.tiles[coord.y][coord.x].style.font = this.letterStyle.font;
        this.tiles[coord.y][coord.x].style.color = this.letterStyle.color;

        this.tiles[coord.y][coord.x].oldText = this.tiles[coord.y][coord.x].text;
        this.tiles[coord.y][coord.x].text = letter;
        this.fillGridPortion(
            { x: coord.x, y: coord.y },
            this.tiles[coord.y][coord.x].text,
            this.tiles[coord.y][coord.x].style.color as string,
            this.tiles[coord.y][coord.x].style.font as string,
        );
    }

    drawArrow(direction: boolean, coord: Vec2) {
        const img = document.getElementById('img') as HTMLImageElement;
        const img2 = document.getElementById('img2') as HTMLImageElement;

        const arrow = direction === true ? img : img2;
        const arrowWidth = 13.33;

        this.gridContext.drawImage(
            arrow,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            arrowWidth,
            arrowWidth,
        );
    }

    removeArrow(coord: Vec2) {
        if (coord.x === NOT_FOUND || coord.y === NOT_FOUND) {
            return;
        }
        this.fillGridPortion(
            coord,
            this.tiles[coord.y][coord.x].text,
            this.tiles[coord.y][coord.x].style.color as string,
            this.tiles[coord.y][coord.x].style.font as string,
        );
    }

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
        const fillStyle = 'rgb(245, 241, 222)';
        const strokeStyle = 'black';
        const lineWidth = 1;
        this.gridContext.beginPath();
        this.changeGridStyle(fillStyle, undefined, strokeStyle, lineWidth);
        this.gridContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                this.squareColor = 'black';
                this.fillGridPortion({ y, x }, this.tiles[y][x].text, this.tiles[y][x].style.color as string, this.tiles[y][x].style.font as string);
            }
        }
        this.drawGridOutdoor();
    }

    fillGridPortion(coord: Vec2, letter: string, color: string, font: string) {
        const lettersPixelsWidthAdjustment = 2;
        const lettersPixelsHeighAdjustment = 22;
        const pointsPixelsWidthAdjustment = 16;
        const pointsPixelsHeighAdjustment = 30;
        this.gridContext.clearRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.changeGridStyle(color, undefined, this.squareColor, this.squareLineWidth);

        this.gridContext.fillRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.changeGridStyle(undefined, undefined, this.border.squareBorderColor as string);

        this.gridContext.strokeRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        const fillStyle = 'black';
        this.changeGridStyle(fillStyle, font);
        this.gridContext.strokeStyle = 'black';
        this.gridContext.strokeText(
            letter.toUpperCase(),
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + lettersPixelsWidthAdjustment,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + lettersPixelsHeighAdjustment,
        );

        let character = this.reserveService.findLetterInReserve(letter);

        if (character !== NOT_FOUND && letter !== '') {
            character = character as ICharacter;

            this.changeGridStyle(this.pointStyle.color, this.pointStyle.font);
            const points =
                this.tiles[coord.y][coord.x].letter !== '' &&
                this.tiles[coord.y][coord.x].letter === this.tiles[coord.y][coord.x].letter.toUpperCase()
                    ? 0
                    : character.points;

            this.gridContext.strokeText(
                points.toString(),
                (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + pointsPixelsWidthAdjustment,
                (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + pointsPixelsHeighAdjustment,
            );
        }

        this.gridContext.stroke();
    }

    changeGridStyle(fillStyle?: string, font?: string, strokeStyle?: string, lineWidth?: number): void {
        this.gridContext.fillStyle = fillStyle as string;
        this.gridContext.font = font as string;
        this.gridContext.strokeStyle = strokeStyle as string;
        this.gridContext.lineWidth = lineWidth as number;
    }
    changeTileSize(letterStep: number, pointStep: number) {
        const letterFont = this.letterStyle.font as string;
        const pointFont = this.pointStyle.font as string;
        let letterPolice: number = +letterFont.split('px')[0];
        let pointPolice: number = +pointFont.split('px')[0];

        letterPolice += letterStep;
        pointPolice += pointStep;
        this.letterStyle.font = letterPolice.toString() + 'px serif';
        this.pointStyle.font = pointPolice.toString() + 'px serif';
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                if (!BONUSES.includes(this.tiles[y][x].text) && this.tiles[y][x].text !== '') {
                    this.tiles[y][x].style.font = this.letterStyle.font;
                    this.squareColor = 'black';
                    this.fillGridPortion(
                        { y, x },
                        this.tiles[y][x].text,
                        this.tiles[y][x].style.color as string,
                        this.tiles[y][x].style.font as string,
                    );
                    this.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
                }
            }
        }
    }
    increaseTileSize(letterStep: number, pointStep: number, maxValue: number) {
        const letterFont = this.letterStyle.font as string;
        const pointFont = this.pointStyle.font as string;
        const updateMaxValue = 12;

        const letterPolice: number = +letterFont.split('px')[0];

        const pointPolice: number = +pointFont.split('px')[0];

        const pointMaxValue: number = maxValue - updateMaxValue;

        if (letterPolice < maxValue) {
            this.changeTileSize(letterStep, pointStep);
        }

        if (pointPolice < pointMaxValue) {
            this.changeTileSize(letterStep, pointStep);
        }
    }
    decreaseTileSize(letterStep: number, pointStep: number, minValue: number) {
        const letterFont = this.letterStyle.font as string;
        const pointFont = this.pointStyle.font as string;

        const pointPolice: number = +letterFont.split('px')[0];
        const letterPolice: number = +pointFont.split('px')[0];

        if (letterPolice > minValue) {
            this.changeTileSize(letterStep, pointStep);
        }

        if (pointPolice > minValue) {
            this.changeTileSize(letterStep, pointStep);
        }

        return false;
    }
}
