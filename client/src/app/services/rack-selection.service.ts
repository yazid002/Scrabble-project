import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ICharacter } from '@app/classes/letter';
import { SQUARE_WIDTH } from '@app/constants/board-constants';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { GridService } from './grid.service';
import { RackService } from './rack.service';
import { TileSelectionService } from './tile-selection.service';

@Injectable({
    providedIn: 'root',
})
export class RackSelectionService {
    selectedIndexes: number[] = [];
    selectedIndexesForExchange: number[] = [];
    selectedIndexesForPlacement: number[] = [];
    selectedIndexesForManipulation: number[] = [];
    constructor(private rackService: RackService, private gridService: GridService, private tileSelectionService: TileSelectionService) {}

    getClickIndex(event: MouseEvent, rack: ICharacter[]): number {
        console.log('{ x, y} :', event.offsetX, event.offsetY);
        const notFound = -1;
        for (let i = 0; i < rack.length; i++) {
            if (event.offsetX >= i * (DEFAULT_WIDTH / RACK_SIZE) && event.offsetX < (i + 1) * (DEFAULT_WIDTH / RACK_SIZE)) {
                console.log(i);
                return i;
            }
        }
        return notFound;
    }

    getSelectedLetters(rack: ICharacter[], selectedIndexes: number[]): string[] {
        const selectedLetters = [];
        for (const index of selectedIndexes) {
            selectedLetters.push(rack[index].name.toLocaleLowerCase());
        }
        console.log(selectedLetters);
        return selectedLetters;
    }

    onMouseRightClick(event: MouseEvent, rack: ICharacter[]) {
        const normalColor = 'NavajoWhite';
        const selectionColor = 'blue';
        const index = this.getClickIndex(event, rack);
        const alreadySelectedForExchange = this.selectedIndexesForExchange.includes(index);
        const alreadySelectedForOthers = this.selectedIndexesForPlacement.includes(index) || this.selectedIndexesForManipulation.includes(index);

        console.log(this.selectedIndexesForExchange);
        console.log(alreadySelectedForExchange);
        if (alreadySelectedForExchange) {
            this.selectedIndexesForExchange = this.selectedIndexesForExchange.filter((elem) => {
                console.log(elem);
                console.log(index);
                return elem !== index;
            });
            console.log(this.selectedIndexesForExchange);
            this.rackService.fillRackPortion(index, normalColor);
        } else if (!alreadySelectedForOthers) {
            this.selectedIndexesForExchange.push(index);
            this.rackService.fillRackPortion(index, selectionColor);
            console.log(this.selectedIndexesForExchange);
        }
    }

    onKeyBoardClick(event: KeyboardEvent, rack: ICharacter[]) {
        const notFound = -1;
        const selectionColor = 'red';

        const index = this.getIndexFromKey(event, rack);

        const alreadySelectedForOthers = this.selectedIndexesForExchange.includes(index) || this.selectedIndexesForManipulation.includes(index);

        if (index !== notFound) {
            if (!alreadySelectedForOthers) {
                this.selectedIndexesForPlacement.push(index);
                this.rackService.fillRackPortion(index, selectionColor);
                this.gridService.writeLetter(event.key, {
                    x: this.tileSelectionService.selectedCoord.y,
                    y: this.tileSelectionService.selectedCoord.x,
                });
                console.log('selectedCoord :', this.tileSelectionService.selectedCoord);
                console.log(' this.tileSelectionService.direction :', this.tileSelectionService.direction);
                const nextCoord = this.tileSelectionService.direction
                    ? { x: this.tileSelectionService.selectedCoord.x + 1, y: this.tileSelectionService.selectedCoord.y }
                    : { x: this.tileSelectionService.selectedCoord.x, y: this.tileSelectionService.selectedCoord.y + 1 };

                console.log('nextCoord :', nextCoord);
                this.tileSelectionService.onTileClick({
                    button: 0,
                    offsetX: nextCoord.x * SQUARE_WIDTH,
                    offsetY: nextCoord.y * SQUARE_WIDTH,
                } as MouseEvent);
            }
        }
    }

    getIndexFromKey(event: KeyboardEvent, rack: ICharacter[]) {
        const notFound = -1;
        const letterToFound = event.key === event.key.toUpperCase() ? '*' : event.key.toUpperCase();

        for (let i = 0; i < rack.length; i++) {
            if (rack[i].name === letterToFound) {
                if (!this.selectedIndexesForPlacement.includes(i)) {
                    return i;
                }
            }
        }
        return notFound;
    }

    // onPlacementCancel() {
    //     this.tileSelectionService.cancelPlacement();
    // }

    buildPlacementCommand(rack: ICharacter[]): string {
        console.log(rack);
        const lettersToPlace = this.getSelectedLetters(rack, this.selectedIndexesForPlacement);
        return `!placer ${String.fromCharCode(this.tileSelectionService.selectedIndexesForPlacement[0].y + 'A'.charCodeAt(0)).toLowerCase()}${
            this.tileSelectionService.selectedIndexesForPlacement[0].x + 1
        }${this.tileSelectionService.direction ? 'h' : 'v'} ${lettersToPlace.join('')}`;
    }

    cancelPlacement() {
        const normalColor = 'NavajoWhite';
        //  this.tileSelectionService.selectedIndexesForPlacement.pop();
        console.log('length 1: ', this.tileSelectionService.selectedIndexesForPlacement.length);
        console.log('length 2: ', this.selectedIndexesForPlacement.length);
        if (this.tileSelectionService.selectedIndexesForPlacement.length > this.selectedIndexesForPlacement.length) {
            const length = this.tileSelectionService.selectedIndexesForPlacement.length;
            const coord = this.tileSelectionService.selectedIndexesForPlacement[length - 1];
            tiles[coord.y][coord.x].style.color = tiles[coord.y][coord.x].oldStyle.color;
            tiles[coord.y][coord.x].text = tiles[coord.y][coord.x].oldText;
            this.gridService.fillGridPortion({ x: coord.y, y: coord.x }, tiles[coord.y][coord.x].text, tiles[coord.y][coord.x].style);
            this.tileSelectionService.selectedIndexesForPlacement.pop();
            console.log(this.tileSelectionService.selectedIndexesForPlacement.length);
        }
        console.log('length 1: ', this.tileSelectionService.selectedIndexesForPlacement.length);
        console.log('length 2: ', this.selectedIndexesForPlacement.length);
        if (this.tileSelectionService.selectedIndexesForPlacement.length > 0) {
            const length = this.tileSelectionService.selectedIndexesForPlacement.length;
            const coord = this.tileSelectionService.selectedIndexesForPlacement[length - 1];
            tiles[coord.y][coord.x].style.color = tiles[coord.y][coord.x].oldStyle.color;
            tiles[coord.y][coord.x].text = tiles[coord.y][coord.x].oldText;
            this.gridService.fillGridPortion({ x: coord.y, y: coord.x }, tiles[coord.y][coord.x].text, tiles[coord.y][coord.x].style);
            this.rackService.fillRackPortion(this.selectedIndexesForPlacement[length - 1], normalColor);
            this.tileSelectionService.selectedIndexesForPlacement.pop();
            this.selectedIndexesForPlacement.pop();
        }
        console.log('length 1: ', this.tileSelectionService.selectedIndexesForPlacement.length);
        console.log('length 2: ', this.selectedIndexesForPlacement.length);
    }
}
