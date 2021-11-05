import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Bonus } from '@app/classes/bonus';
import { SQUARE_HEIGHT, SQUARE_NUMBER, SQUARE_WIDTH } from '@app/constants/board-constants';
import { GridService } from './grid.service';

@Injectable({
    providedIn: 'root',
})
export class RandomModeService {
    bonusOnGrid: Bonus[] = [
        { text: 'tw', color: 'IndianRed', quantity: 8 },
        { text: 'tl', color: 'RoyalBlue', quantity: 12 },
        { text: 'dw', color: 'LightPink', quantity: 17 },
        { text: 'dl', color: 'LightSkyBlue', quantity: 24 },
    ];

    randomBonusIndex: number = 0;
    isChecked: boolean = false;

    constructor(private gridService: GridService) {}

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
        if (!this.isChecked) {
            return;
        }
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                if (tiles[y][x].bonus === 'xx') {
                    continue;
                }

                index = this.randomizeIndex(min, max);
                tiles[y][x].bonus = this.bonusOnGrid[index].text;
                tiles[y][x].text = this.bonusOnGrid[index].text;
                tiles[y][x].style.color = this.bonusOnGrid[index].color;

                this.gridService.fillGridPortion({ y, x }, tiles[y][x].text, tiles[y][x].style.color as string, tiles[y][x].style.font as string);
                this.gridService.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
                this.bonusOnGrid[index].quantity--;
            }
        }

        localStorage.setItem('bonusGrid', JSON.stringify(tiles));
    }
}
