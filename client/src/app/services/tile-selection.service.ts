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

                // if (tiles[x][y].letter !== '') {
                //     tiles[x][y].style.font = this.gridService.letterStyle.font;
                //     this.gridService.fillGridPortion({ x, y }, tiles[x][y].text, tiles[x][y].style);
                //     this.gridService.gridContext.strokeRect(x * SQUARE_WIDTH, y * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
                // }
            }
        }
        return { x: notFound, y: notFound };
    }

    onTileClick(event: MouseEvent) {
        console.log('{ x, y} :', event.offsetX, event.offsetY);
        const coord = this.getClickIndex(event);
        if (this.selectedCoord.x === -1 && this.selectedCoord.y === -1) {
            this.selectedCoord = coord;
            console.log(
                'oldStyle, style: ',
                tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle,
                tiles[this.selectedCoord.y][this.selectedCoord.x].style,
            );
            tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle.color = tiles[this.selectedCoord.y][this.selectedCoord.x].style.color;
            tiles[this.selectedCoord.y][this.selectedCoord.x].style.color = 'red';
            tiles[this.selectedCoord.y][this.selectedCoord.x].style.font = this.gridService.letterStyle.font;
            console.log(
                'oldStyle, style: apres premier click',
                tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle,
                tiles[this.selectedCoord.y][this.selectedCoord.x].style,
            );
            this.gridService.fillGridPortion(
                { x: this.selectedCoord.y, y: this.selectedCoord.x },
                tiles[this.selectedCoord.y][this.selectedCoord.x].text,
                tiles[this.selectedCoord.y][this.selectedCoord.x].style,
            );
            this.gridService.gridContext.strokeRect(
                this.selectedCoord.y * SQUARE_WIDTH,
                this.selectedCoord.x * SQUARE_HEIGHT,
                SQUARE_HEIGHT,
                SQUARE_WIDTH,
            );
        }
        if (coord.x !== this.selectedCoord.x || coord.y !== this.selectedCoord.y) {
            console.log(
                'oldStyle, style si je clique sur une autre avant: ',
                tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle,
                tiles[this.selectedCoord.y][this.selectedCoord.x].style,
            );
            tiles[this.selectedCoord.y][this.selectedCoord.x].style.color = tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle.color;
            console.log(
                'oldStyle, style si je clique sur une autre apres pour l ancienne case: ',
                tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle,
                tiles[this.selectedCoord.y][this.selectedCoord.x].style,
            );
            this.gridService.fillGridPortion(
                { x: this.selectedCoord.y, y: this.selectedCoord.x },
                tiles[this.selectedCoord.y][this.selectedCoord.x].text,
                tiles[this.selectedCoord.y][this.selectedCoord.x].style,
            );
            this.gridService.gridContext.strokeRect(coord.y * SQUARE_WIDTH, coord.x * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);

            this.selectedCoord = coord;
            tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle.color = tiles[this.selectedCoord.y][this.selectedCoord.x].style.color;
            tiles[this.selectedCoord.y][this.selectedCoord.x].style.color = 'red';
            tiles[this.selectedCoord.y][this.selectedCoord.x].style.font = this.gridService.letterStyle.font;
            console.log(
                'oldStyle, style si je clique sur une autre apres: ',
                tiles[this.selectedCoord.y][this.selectedCoord.x].oldStyle,
                tiles[this.selectedCoord.y][this.selectedCoord.x].style,
            );
            this.gridService.fillGridPortion(
                { x: this.selectedCoord.y, y: this.selectedCoord.x },
                tiles[this.selectedCoord.y][this.selectedCoord.x].text,
                tiles[this.selectedCoord.y][this.selectedCoord.x].style,
            );
            this.gridService.gridContext.strokeRect(
                this.selectedCoord.y * SQUARE_WIDTH,
                this.selectedCoord.x * SQUARE_HEIGHT,
                SQUARE_HEIGHT,
                SQUARE_WIDTH,
            );
        } else {
            this.direction = !this.direction;
            // tiles[coord.y][coord.x].oldStyle.color = tiles[coord.y][coord.x].style.color;
            // tiles[coord.y][coord.x].style.color = 'red';
            // tiles[coord.y][coord.x].style.font = this.gridService.letterStyle.font;

            this.gridService.fillGridPortion({ x: coord.y, y: coord.x }, tiles[coord.y][coord.x].text, tiles[coord.y][coord.x].style);
            // this.gridService.gridContext.strokeRect(coord.y * SQUARE_WIDTH, coord.x * SQUARE_HEIGHT, SQUARE_HEIGHT, SQUARE_WIDTH);
            this.gridService.drawArrow(this.direction, { x: this.selectedCoord.y, y: this.selectedCoord.x });
        }
    }
}
