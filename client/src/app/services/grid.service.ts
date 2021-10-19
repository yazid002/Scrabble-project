import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { CaseStyle } from '@app/classes/case-style';
import { ICharacter as ICharacter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH, SQUARE_HEIGHT, SQUARE_NUMBER, SQUARE_WIDTH } from '@app/constants/board-constants';
import { ReserveService } from '@app/services/reserve.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    letterStyle: CaseStyle = { color: 'NavajoWhite', font: '15px serif' };
    pointStyle: CaseStyle = { color: 'NavajoWhite', font: '10px serif' };
    squareColor: string = 'black';
    squareLineWidth: number = 0;

    gridContext: CanvasRenderingContext2D;

    constructor(private reserveService: ReserveService) {}

    writeLetter(letter: string, coord: Vec2): void {
        tiles[coord.y][coord.x].oldStyle.color = tiles[coord.y][coord.x].style.color;
        tiles[coord.y][coord.x].oldStyle.font = tiles[coord.y][coord.x].style.font;

        console.log('letterStyle1 :', this.letterStyle);
        tiles[coord.y][coord.x].style.font = this.letterStyle.font;
        tiles[coord.y][coord.x].style.color = this.letterStyle.color;
        console.log('letterStyle2 :', tiles[coord.y][coord.x].style);

        tiles[coord.y][coord.x].oldText = tiles[coord.y][coord.x].text;
        tiles[coord.y][coord.x].text = letter;
        // this.squareColor = 'black';
        // this.squareLineWidth = 1;
        // this.squareLineWidth = 1;
        // this.squareColor = 'red';
        this.fillGridPortion({ x: coord.x, y: coord.y }, tiles[coord.y][coord.x].text, tiles[coord.y][coord.x].style);
        console.log('testvalid', tiles);
    }

    drawArrow(direction: boolean, coord: Vec2) {
        const img = document.getElementById('img') as HTMLImageElement;
        const img2 = document.getElementById('img2') as HTMLImageElement;

        const arrow = direction === true ? img : img2;

        const fillStyle = 'violet';
        this.changeGridStyle(fillStyle, '10px serif');

        this.gridContext.drawImage(arrow, (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x, (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y, 13.33, 13.33);
    }

    removeArrow(coord: Vec2) {
        // const strokeStyle = 'black';
        // this.changeGridStyle(tiles[coord.x][coord.y].style.color, undefined, strokeStyle);
        // this.gridContext.fillRect((DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y, (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x, 13.33, 13.33);
        // this.gridContext.strokeRect(
        //     (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
        //     (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
        //     DEFAULT_WIDTH / SQUARE_NUMBER,
        //     DEFAULT_WIDTH / SQUARE_NUMBER,
        // );
        this.squareColor = 'black';
        this.squareLineWidth = 0;
        this.fillGridPortion(coord, tiles[coord.y][coord.x].text, tiles[coord.y][coord.x].style);
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
                this.squareLineWidth = 0;
                this.fillGridPortion({ y, x }, tiles[y][x].text, tiles[y][x].style);
                // this.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
            }
        }
        this.drawGridOutdoor();
    }

    fillGridPortion(coord: Vec2, letter: string, style: CaseStyle) {
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

        //  const strokeStyle = 'black';
        //  const lineWidth = this.squareLineWidth;
        this.changeGridStyle(style.color, undefined, this.squareColor, this.squareLineWidth);

        this.gridContext.fillRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.gridContext.strokeRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        // console.log('squareLineWidth ', this.squareLineWidth);
        //  this.drawGridPortionBorder(this.squareColor, coord, 2);

        const fillStyle = 'black';
        this.changeGridStyle(fillStyle, style.font);
        this.gridContext.strokeText(
            letter.toUpperCase(),
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + lettersPixelsWidthAdjustment,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + lettersPixelsHeighAdjustment,
        );

        let character = this.reserveService.findLetterInReserve(letter);
        const notFound = -1;
        if (character !== notFound && letter !== '') {
            character = character as ICharacter;

            this.changeGridStyle(this.pointStyle.color, this.pointStyle.font);
            this.gridContext.strokeText(
                character.points.toString(),
                (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + pointsPixelsWidthAdjustment,
                (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + pointsPixelsHeighAdjustment,
            );
        }

        this.gridContext.stroke();
    }

    drawGridPortionBorder(borderColor: string, coord: Vec2, width: number): void {
        this.changeGridStyle(borderColor, undefined, this.squareColor, width);

        // this.gridContext.strokeRect(
        //     (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + width,
        //     (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + width,
        //     DEFAULT_WIDTH / SQUARE_NUMBER - width,
        //     DEFAULT_WIDTH / SQUARE_NUMBER - width,
        // );
        this.gridContext.beginPath();
        this.gridContext.moveTo((DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x, (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y);
        this.gridContext.lineTo((DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x, (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + DEFAULT_WIDTH / SQUARE_NUMBER);
        this.gridContext.lineTo(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + DEFAULT_WIDTH / SQUARE_NUMBER,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + DEFAULT_WIDTH / SQUARE_NUMBER,
        );
        this.gridContext.lineTo((DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + DEFAULT_WIDTH / SQUARE_NUMBER, (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y);
    }

    changeGridStyle(fillStyle?: string, font?: string, strokeStyle?: string, lineWidth?: number): void {
        this.gridContext.fillStyle = fillStyle as string;
        this.gridContext.font = font as string;
        this.gridContext.strokeStyle = strokeStyle as string;
        this.gridContext.lineWidth = lineWidth as number;
    }

    changeTileSize(letterStep: number, pointStep: number) {
        let letterPolice: number = +this.letterStyle.font.split('px')[0];
        let pointPolice: number = +this.pointStyle.font.split('px')[0];

        letterPolice += letterStep;
        pointPolice += pointStep;
        this.letterStyle.font = letterPolice.toString() + 'px serif';
        this.pointStyle.font = pointPolice.toString() + 'px serif';

        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                if (tiles[y][x].letter !== '') {
                    tiles[y][x].style.font = this.letterStyle.font;
                    this.squareColor = 'black';
                    this.squareLineWidth = 0;
                    this.fillGridPortion({ y, x }, tiles[y][x].text, tiles[y][x].style);
                    this.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
                }
            }
        }
    }

    increaseTileSize(letterStep: number, pointStep: number, maxValue: number) {
        const updateMaxValue = 12;
        const letterPolice: number = +this.letterStyle.font.split('px')[0];

        const pointPolice: number = +this.pointStyle.font.split('px')[0];

        const pointMaxValue: number = maxValue - updateMaxValue;

        if (letterPolice < maxValue) {
            this.changeTileSize(letterStep, pointStep);
        }

        if (pointPolice < pointMaxValue) {
            this.changeTileSize(letterStep, pointStep);
        }
    }

    decreaseTileSize(letterStep: number, pointStep: number, minValue: number) {
        const pointPolice: number = +this.pointStyle.font.split('px')[0];
        const letterPolice: number = +this.letterStyle.font.split('px')[0];

        if (letterPolice > minValue) {
            this.changeTileSize(letterStep, pointStep);
        }

        if (pointPolice > minValue) {
            this.changeTileSize(letterStep, pointStep);
        }

        return false;
    }
}
