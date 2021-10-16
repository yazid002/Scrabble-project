import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Bonus } from '@app/classes/bonus';
import { CaseStyle } from '@app/classes/case-style';
import { ICharacter as ICharacter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { bonuses, DEFAULT_HEIGHT, DEFAULT_WIDTH, SQUARE_HEIGHT, SQUARE_NUMBER, SQUARE_WIDTH } from '@app/constants/board-constants';
import { ReserveService } from '@app/services/reserve.service';

@Injectable({
    providedIn: 'root',
})
export class GridService {
    bonusOnGrid: Bonus[] = [
        { text: 'tw', color: 'IndianRed', quantity: 8 },
        { text: 'tl', color: 'RoyalBlue', quantity: 12 },
        { text: 'dw', color: 'LightPink', quantity: 17 },
        { text: 'dl', color: 'LightSkyBlue', quantity: 24 },
    ];

    randomBonusIndex: number;

    letterStyle: CaseStyle = { color: 'NavajoWhite', font: '15px serif' };
    pointStyle: CaseStyle = { color: 'NavajoWhite', font: '10px serif' };
    squareColor: string = 'black';
    border: CaseStyle = { squareborder: 'black' };
    squareLineWidth: number = 1;

    gridContext: CanvasRenderingContext2D;

    constructor(private reserveService: ReserveService) {}

    writeLetter(letter: string, coord: Vec2, throughChat: boolean): void {
        console.log(throughChat);
        //   if (throughChat) {
        tiles[coord.y][coord.x].oldStyle.color = tiles[coord.y][coord.x].style.color;
        tiles[coord.y][coord.x].oldStyle.font = tiles[coord.y][coord.x].style.font;

        console.log('letterStyle1 :', this.letterStyle);
        tiles[coord.y][coord.x].style.font = this.letterStyle.font;
        tiles[coord.y][coord.x].style.color = this.letterStyle.color;
        console.log('letterStyle2 :', tiles[coord.y][coord.x].style);

        tiles[coord.y][coord.x].oldText = tiles[coord.y][coord.x].text;
        tiles[coord.y][coord.x].text = letter;
        this.fillGridPortion(
            { x: coord.x, y: coord.y },
            tiles[coord.y][coord.x].text,
            tiles[coord.y][coord.x].style.color as string,
            tiles[coord.y][coord.x].style.font as string,
        );
        // } else {
        //     this.fillGridPortion({ x: coord.x, y: coord.y }, letter, this.letterStyle);
        // }

        // this.squareColor = 'black';
        // this.squareLineWidth = 1;
        // this.squareLineWidth = 1;
        // this.squareColor = 'red';

        this.fillGridPortion(
            { x: coord.x, y: coord.y },
            tiles[coord.x][coord.y].text,
            tiles[coord.x][coord.y].style.color as string,
            tiles[coord.x][coord.y].style.font as string,
        );
        console.log('testvalid', tiles);
    }

    drawArrow(direction: boolean, coord: Vec2) {
        const img = document.getElementById('img') as HTMLImageElement;
        const img2 = document.getElementById('img2') as HTMLImageElement;

        const arrow = direction === true ? img : img2;

        // const fillStyle = 'violet';
        // this.changeGridStyle(fillStyle, '10px serif');
        // tiles[coord.x][coord.y].oldStyle = tiles[coord.x][coord.y].style;

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
        // this.squareColor = 'black';
        // this.squareLineWidth = 0;
        //  tiles[coord.x][coord.y].style = tiles[coord.x][coord.y].oldStyle;
        this.fillGridPortion(
            coord,
            tiles[coord.y][coord.x].text,
            tiles[coord.y][coord.x].style.color as string,
            tiles[coord.y][coord.x].style.font as string,
        );

        // console.log(coord);
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
        // const opacity = 0.2;
        const fillStyle = 'rgb(245, 241, 222)';
        const strokeStyle = 'black';
        const lineWidth = 1;
        this.gridContext.beginPath();
        this.changeGridStyle(fillStyle, undefined, strokeStyle, lineWidth);
        this.gridContext.fillRect(0, 0, DEFAULT_WIDTH, DEFAULT_HEIGHT);
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                this.squareColor = 'black';
                // this.squareLineWidth = 0;
                this.fillGridPortion({ y, x }, tiles[y][x].text, tiles[y][x].style.color as string, tiles[y][x].style.font as string);
                //  this.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
            }
        }
        this.drawGridOutdoor();
    }

    fillGridPortion(coord: Vec2, letter: string, color: string, font: string) {
        console.log('le style de la case : ', letter, color);

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
        this.changeGridStyle(color, undefined, this.squareColor, this.squareLineWidth);

        this.gridContext.fillRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        this.gridContext.strokeStyle = this.border.squareborder as string;

        this.gridContext.strokeRect(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y,
            DEFAULT_WIDTH / SQUARE_NUMBER,
            DEFAULT_WIDTH / SQUARE_NUMBER,
        );

        //  this.drawGridPortionBorder(this.squareColor, coord, 2);

        const fillStyle = 'black';
        this.changeGridStyle(fillStyle, font);
        this.gridContext.strokeStyle = 'black';
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
        this.gridContext.moveTo((DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + 5, (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + 5);
        this.gridContext.lineTo(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + 5,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + DEFAULT_WIDTH / SQUARE_NUMBER - 5,
        );
        this.gridContext.lineTo(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + DEFAULT_WIDTH / SQUARE_NUMBER - 5,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + DEFAULT_WIDTH / SQUARE_NUMBER - 5,
        );
        this.gridContext.lineTo(
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + DEFAULT_WIDTH / SQUARE_NUMBER - 5,
            (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + 5,
        );
        this.gridContext.lineTo((DEFAULT_WIDTH / SQUARE_NUMBER) * coord.y + 5, (DEFAULT_WIDTH / SQUARE_NUMBER) * coord.x + 5);
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
                if (!bonuses.includes(tiles[y][x].text) && tiles[y][x].text !== '') {
                    tiles[y][x].style.font = this.letterStyle.font;
                    this.squareColor = 'black';
                    // this.squareLineWidth = 0;
                    this.fillGridPortion({ y, x }, tiles[y][x].text, tiles[y][x].style.color as string, tiles[y][x].style.font as string);
                    this.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
                }

                console.log(tiles);
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

    // https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Math/random

    getRandomIntInclusive(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    randomizeIndex(minNumber: number, maxNumber: number): number {
        do {
            this.randomBonusIndex = this.getRandomIntInclusive(minNumber, maxNumber);
        } while (this.bonusOnGrid[this.randomBonusIndex].quantity === 0);

        return this.randomBonusIndex;
    }
    randomizeBonus(min: number, max: number): void {
        let index: number;
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                if (tiles[y][x].bonus !== 'xx') {
                    index = this.randomizeIndex(min, max);
                    tiles[y][x].bonus = this.bonusOnGrid[index].text;
                    tiles[y][x].text = this.bonusOnGrid[index].text;
                    tiles[y][x].style.color = this.bonusOnGrid[index].color;

                    this.fillGridPortion({ y, x }, tiles[y][x].text, tiles[y][x].style.color as string, tiles[y][x].style.font as string);
                    this.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
                    this.bonusOnGrid[index].quantity--;
                }
            }
        }
    }
}
