import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ICharacter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { SQUARE_HEIGHT, SQUARE_NUMBER, SQUARE_WIDTH } from '@app/constants/board-constants';
import { NOT_FOUND } from '@app/constants/common-constants';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { KeyboardKeys } from '@app/enums/keyboard-enum';
import { GridService } from './grid.service';
import { RackService } from './rack.service';
import { VerifyService } from './verify.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceSelectionService {
    selectedCoord: Vec2 = { x: -1, y: -1 };
    direction: boolean = true;
    selectedTilesForPlacement: Vec2[] = [];
    selectedRackIndexesForPlacement: number[] = [];
    wordToVerify: string[] = [];
    command: string = '';

    constructor(private gridService: GridService, private verifyService: VerifyService, private rackService: RackService) {}

    getClickIndex(event: MouseEvent, rack: ICharacter[]): number {
        for (let i = 0; i < rack.length; i++) {
            if (event.offsetX >= i * (DEFAULT_WIDTH / RACK_SIZE) && event.offsetX < (i + 1) * (DEFAULT_WIDTH / RACK_SIZE)) {
                return i;
            }
        }
        return NOT_FOUND;
    }

    getClickCoords(event: MouseEvent): Vec2 {
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                if (
                    event.offsetX >= x * SQUARE_WIDTH &&
                    event.offsetX < (x + 1) * SQUARE_WIDTH &&
                    event.offsetY >= y * SQUARE_HEIGHT &&
                    event.offsetY < (y + 1) * SQUARE_HEIGHT
                ) {
                    return { x, y };
                }
            }
        }
        return { x: NOT_FOUND, y: NOT_FOUND };
    }

    getIndexOnRackFromKey(eventKey: string, rack: ICharacter[]) {
        const regexp = new RegExp('^[A-Z]$');
        const letterToFound = regexp.test(eventKey) ? '*' : eventKey.toUpperCase();

        for (let i = 0; i < rack.length; i++) {
            if (rack[i].name === letterToFound) {
                if (!this.selectedRackIndexesForPlacement.includes(i)) {
                    return i;
                }
            }
        }
        return NOT_FOUND;
    }

    buildPlacementCommand(): string {
        const wordToVerify: string[] = [];
        // console.log()
        if (this.selectedTilesForPlacement.length === 0) {
            return '';
        }
        if (this.direction) {
            const y = this.selectedTilesForPlacement[0].y;
            for (let x = this.selectedTilesForPlacement[0].x; x <= this.selectedTilesForPlacement[this.selectedTilesForPlacement.length - 1].x; x++) {
                wordToVerify.push(tiles[y][x].text);
            }
        } else {
            const x = this.selectedTilesForPlacement[0].x;
            for (let y = this.selectedTilesForPlacement[0].y; y <= this.selectedTilesForPlacement[this.selectedTilesForPlacement.length - 1].y; y++) {
                wordToVerify.push(tiles[y][x].text);
            }
        }

        return `!placer ${String.fromCharCode(this.selectedTilesForPlacement[0].y + 'A'.charCodeAt(0)).toLowerCase()}${
            this.selectedTilesForPlacement[0].x + 1
        }${this.direction ? 'h' : 'v'} ${wordToVerify.join('')}`;
    }

    onKeyBoardClick(event: KeyboardEvent, rack: ICharacter[]) {
        const selectionColor = 'darkorchid';
        const regexp = new RegExp('^[a-zA-Z]$');
        const eventKey = this.verifyService.normalizeWord(event.key);
        if (regexp.test(eventKey)) {
            return this.placeOnBoard(eventKey, selectionColor, rack);
        } else
            switch (event.key) {
                case KeyboardKeys.Backspace: {
                    this.cancelUniqueSelectionFromRack();
                    this.cancelUniqueBoardClick();

                    break;
                }
                case KeyboardKeys.Enter: {
                    this.command = this.buildPlacementCommand();
                    break;
                }
                case KeyboardKeys.Escape: {
                    this.cancelPlacement();

                    break;
                }
            }
    }

    placeOnBoard(eventKey: string, selectionColor: string, rack: ICharacter[]): void {
        const index = this.getIndexOnRackFromKey(eventKey, rack);
        if (!this.checkPlacementFeasibility(this.selectedCoord, index)) {
            return;
        }

        this.selectedRackIndexesForPlacement.push(index);
        this.rackService.fillRackPortion(index, selectionColor);

        this.selectedTilesForPlacement.push(this.selectedCoord);
        this.gridService.squareColor = selectionColor;
        this.gridService.border.squareBorderColor = selectionColor;
        this.gridService.writeLetter(eventKey, this.selectedCoord, false);

        return this.moveToNextEmptyTile(this.selectedCoord);
    }

    checkPlacementFeasibility(coord: Vec2, index: number): boolean {
        if (index === NOT_FOUND) {
            return false;
        }
        if (!this.areCoordValid(coord)) {
            return false;
        }
        if (this.isTileAlreadySelected(coord)) {
            return false;
        }
        return true;
    }

    isTileAlreadySelected(coord: Vec2): boolean {
        return this.selectedTilesForPlacement.includes(coord);
    }

    areCoordValid(coord: Vec2): boolean {
        return coord.y < SQUARE_NUMBER && coord.x < SQUARE_NUMBER && coord.x >= 0 && coord.y >= 0;
    }
    incrementNextCoord(coord: Vec2): Vec2 {
        let nextCoord = { x: coord.x, y: coord.y };
        while (!(tiles[nextCoord.y][nextCoord.x].text === '' || tiles[nextCoord.y][nextCoord.x].text.length === 2)) {
            //    this.wordToVerify.push(tiles[nextCoord.y][nextCoord.x].text);
            if (nextCoord.y === SQUARE_NUMBER - 1 || nextCoord.x === SQUARE_NUMBER - 1) {
                break;
            }
            nextCoord = this.direction ? (nextCoord = { x: nextCoord.x + 1, y: nextCoord.y }) : (nextCoord = { x: nextCoord.x, y: nextCoord.y + 1 });
        }
        return nextCoord;
    }

    moveToNextEmptyTile(coord: Vec2): void {
        const nextCoord = this.incrementNextCoord(coord);
        if (nextCoord.x === coord.x && nextCoord.y === coord.y) {
            return;
        }
        this.onBoardClick(
            {
                button: 0,
                offsetX: nextCoord.x * SQUARE_WIDTH,
                offsetY: nextCoord.y * SQUARE_WIDTH,
            } as MouseEvent,
            false,
        );
    }

    cancelUniqueSelectionFromRack() {
        const toRemove = this.selectedRackIndexesForPlacement.pop();
        //  this.wordToVerify.pop();
        // console.log('wordToVerify ', this.wordToVerify);
        if (toRemove === undefined) {
            return;
        }
        const normalColor = 'NavajoWhite';
        this.rackService.fillRackPortion(toRemove as number, normalColor);
    }

    cancelPlacement() {
        while (this.selectedCoord.x !== NOT_FOUND) {
            this.cancelUniqueSelectionFromRack();
            this.cancelUniqueBoardClick();
        }
    }

    hideOperation() {
        return this.selectedRackIndexesForPlacement.length === 0;
    }

    onBoardClick(event: MouseEvent, shouldChangeDirection: boolean) {
        const notFound = { x: NOT_FOUND, y: NOT_FOUND };
        const coord = this.getClickCoords(event);

        if (!this.checkBoardClickFeasibility(coord, shouldChangeDirection)) {
            return;
        }

        if (this.selectedCoord.x === notFound.x && this.selectedCoord.y === notFound.y) {
            // on clique pour la premiere fois
            this.selectedCoord = coord;
        } else if (coord.x !== this.selectedCoord.x || coord.y !== this.selectedCoord.y) {
            // on clique sur une autre case apres avoir déja cliqué une premiere fois
            if (shouldChangeDirection) {
                this.direction = true;
            }
            this.gridService.removeArrow(this.selectedCoord);
            this.selectedCoord = coord;
        } else {
            // on clique sur le même, on change de direction
            this.direction = !this.direction;
            this.gridService.removeArrow(this.selectedCoord);
        }

        this.gridService.drawArrow(this.direction, this.selectedCoord);
    }

    checkBoardClickFeasibility(coord: Vec2, shouldChangeDirection: boolean): boolean {
        const notFound = { x: NOT_FOUND, y: NOT_FOUND };

        if (!(this.selectedRackIndexesForPlacement.length === 0 || !shouldChangeDirection === true)) {
            return false;
        }
        if (!(coord.x !== notFound.x && coord.y !== notFound.y)) {
            return false;
        }
        return true;
    }

    cancelUniqueBoardClick() {
        const coord = this.selectedTilesForPlacement.pop();
        if (this.selectedTilesForPlacement.length === 0 && this.selectedCoord.x !== -1) {
            console.log('le selected coord 1 ', this.selectedCoord);
            this.gridService.removeArrow(this.selectedCoord);
        }

        if (coord) {
            this.gridService.border.squareBorderColor = 'black';
            this.gridService.removeArrow(this.selectedCoord);
            tiles[coord.y][coord.x].text = tiles[coord.y][coord.x].oldText;
            tiles[coord.y][coord.x].style.color = tiles[coord.y][coord.x].oldStyle.color;
            this.gridService.fillGridPortion(
                coord,
                tiles[coord.y][coord.x].text,
                tiles[coord.y][coord.x].style.color as string,
                tiles[coord.y][coord.x].style.font as string,
            );

            this.selectedCoord.x = coord.x;
            this.selectedCoord.y = coord.y;
            this.gridService.drawArrow(this.direction, this.selectedCoord);
        }
        if (this.selectedTilesForPlacement.length === 0) {
            console.log('le selected coord ', this.selectedCoord);
            this.gridService.removeArrow(this.selectedCoord);
            this.selectedCoord.x = -1;
            this.selectedCoord.y = -1;
        }
    }
}
