import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { Vec2 } from '@app/classes/vec2';
import { SQUARE_HEIGHT, SQUARE_NUMBER, SQUARE_WIDTH } from '@app/constants/board-constants';
import { GridService } from '@app/services/grid.service';

@Injectable({
    providedIn: 'root',
})
export class TileSelectionService {
    selectedCoord: Vec2 = { x: -1, y: -1 };
    direction: boolean = true;
    selectedIndexesForPlacement: Vec2[] = [];

    constructor(private gridService: GridService) {}

    getClickIndex(event: MouseEvent): Vec2 {
        const notFound = -1;
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                if (
                    event.offsetX >= x * SQUARE_WIDTH &&
                    event.offsetX < (x + 1) * SQUARE_WIDTH &&
                    event.offsetY >= y * SQUARE_HEIGHT &&
                    event.offsetY < (y + 1) * SQUARE_HEIGHT
                ) {
                    console.log('{ x, y} :', x, y);
                    return { x, y };
                }
            }
        }
        return { x: notFound, y: notFound };
    }

    onTileClick(event: MouseEvent, shouldChangeStyle: boolean, rackToVerify: number[]) {
        if (rackToVerify.length === 0 || !shouldChangeStyle === true) {
            const notFound = -1;
            const coord = this.getClickIndex(event);
            if (this.selectedCoord.x === notFound && this.selectedCoord.y === notFound) {
                this.selectedCoord = coord;
                this.selectedIndexesForPlacement.push(this.selectedCoord);

                tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle.color = tiles[this.selectedCoord.y][this.selectedCoord.x].style.color;
                tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle.font = tiles[this.selectedCoord.y][this.selectedCoord.x].style.font;
                tiles[this.selectedCoord.y][this.selectedCoord.x].style.color = 'red';
                tiles[this.selectedCoord.y][this.selectedCoord.x].style.font = this.gridService.letterStyle.font;
                console.log('0', tiles[this.selectedCoord.y][this.selectedCoord.x]);
            } else if (coord.x !== this.selectedCoord.x || coord.y !== this.selectedCoord.y) {
                if (shouldChangeStyle) {
                    this.direction = true;
                }
                console.log('1', tiles[this.selectedCoord.y][this.selectedCoord.x]);
                if (shouldChangeStyle) {
                    tiles[this.selectedCoord.y][this.selectedCoord.x].style.color = tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle.color;
                    tiles[this.selectedCoord.y][this.selectedCoord.x].style.font = tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle.font;
                }

                this.gridService.fillGridPortion(
                    { x: this.selectedCoord.y, y: this.selectedCoord.x },
                    tiles[this.selectedCoord.y][this.selectedCoord.x].text,
                    tiles[this.selectedCoord.y][this.selectedCoord.x].style.color as string,
                    tiles[this.selectedCoord.y][this.selectedCoord.x].style.font as string,
                );
                this.gridService.gridContext.strokeRect(coord.y * SQUARE_WIDTH, coord.x * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
                console.log('2', tiles[this.selectedCoord.y][this.selectedCoord.x]);

                this.selectedCoord = coord;
                this.selectedIndexesForPlacement.push(this.selectedCoord);
                tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle.color = tiles[this.selectedCoord.y][this.selectedCoord.x].style.color;
                tiles[this.selectedCoord.y][this.selectedCoord.x].style.font = tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle.font;
                tiles[this.selectedCoord.y][this.selectedCoord.x].style.color = 'red';
                console.log('3', tiles[this.selectedCoord.y][this.selectedCoord.x]);
            } else {
                // tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle.color = tiles[this.selectedCoord.y][this.selectedCoord.x].style.color;
                // tiles[this.selectedCoord.y][this.selectedCoord.x].style.color = 'red';

                this.direction = !this.direction;
                tiles[this.selectedCoord.y][this.selectedCoord.x].style.color = 'red';
                console.log('4', tiles[this.selectedCoord.y][this.selectedCoord.x]);
            }

            tiles[this.selectedCoord.y][this.selectedCoord.x].style.font = this.gridService.letterStyle.font;
            this.gridService.fillGridPortion(
                { x: this.selectedCoord.y, y: this.selectedCoord.x },
                tiles[this.selectedCoord.y][this.selectedCoord.x].text,
                tiles[this.selectedCoord.y][this.selectedCoord.x].style.color as string,
                tiles[this.selectedCoord.y][this.selectedCoord.x].style.font as string,
            );
            this.gridService.gridContext.strokeRect(
                this.selectedCoord.y * SQUARE_WIDTH,
                this.selectedCoord.x * SQUARE_HEIGHT,
                SQUARE_HEIGHT,
                SQUARE_WIDTH,
            );
            this.gridService.drawArrow(this.direction, { x: this.selectedCoord.y, y: this.selectedCoord.x });
        }
    }

    cancelPlacement() {
        for (const coord of this.selectedIndexesForPlacement) {
            tiles[coord.y][coord.x].style.color = tiles[coord.y][coord.x].oldStyle.color;
            //  tiles[coord.y][coord.x].text = tiles[coord.y][coord.x].oldText;

            this.gridService.fillGridPortion(
                { x: coord.y, y: coord.x },
                tiles[coord.y][coord.x].oldText,
                tiles[coord.y][coord.x].style.color as string,
                tiles[coord.y][coord.x].style.font as string,
            );
            this.gridService.gridContext.strokeRect(coord.y * SQUARE_WIDTH, coord.x * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
        }
        this.selectedIndexesForPlacement = [];
    }
}
