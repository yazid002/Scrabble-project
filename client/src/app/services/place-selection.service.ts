import { Injectable } from '@angular/core';
import { tiles } from '@app/classes/board';
import { ICharacter } from '@app/classes/letter';
import { Vec2 } from '@app/classes/vec2';
import { SQUARE_HEIGHT, SQUARE_NUMBER, SQUARE_WIDTH } from '@app/constants/board-constants';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
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

    constructor(public gridService: GridService, private verifyService: VerifyService, private rackService: RackService) {}

    getClickIndex(event: MouseEvent, rack: ICharacter[]): number {
        // // console.log('click on rack { x, y} :', event.offsetX, event.offsetY);
        const notFound = -1;
        for (let i = 0; i < rack.length; i++) {
            if (event.offsetX >= i * (DEFAULT_WIDTH / RACK_SIZE) && event.offsetX < (i + 1) * (DEFAULT_WIDTH / RACK_SIZE)) {
                // // console.log(i);
                return i;
            }
        }
        return notFound;
    }

    getClickCoords(event: MouseEvent): Vec2 {
        const notFound = -1;
        for (let x = 0; x < SQUARE_NUMBER; x++) {
            for (let y = 0; y < SQUARE_NUMBER; y++) {
                if (
                    event.offsetX >= x * SQUARE_WIDTH &&
                    event.offsetX < (x + 1) * SQUARE_WIDTH &&
                    event.offsetY >= y * SQUARE_HEIGHT &&
                    event.offsetY < (y + 1) * SQUARE_HEIGHT
                ) {
                    // // console.log('click on board { x, y} :', x, y);
                    return { x: y, y: x };
                }
            }
        }
        return { x: notFound, y: notFound };
    }

    getIndexOnRackFromKey(eventKey: string, rack: ICharacter[]) {
        const notFound = -1;
        const regexp = new RegExp('^[A-Z]$');
        const letterToFound = regexp.test(eventKey) ? '*' : eventKey.toUpperCase();

        // // console.log(letterToFound);
        for (let i = 0; i < rack.length; i++) {
            if (rack[i].name === letterToFound) {
                if (!this.selectedRackIndexesForPlacement.includes(i)) {
                    this.wordToVerify.push(eventKey);
                    return i;
                }
            }
        }
        return notFound;
    }

    buildPlacementCommand(rack: ICharacter[]): string {
        // // console.log(rack);
        return `!placer ${String.fromCharCode(this.selectedTilesForPlacement[0].y + 'A'.charCodeAt(0)).toLowerCase()}${
            this.selectedTilesForPlacement[0].x + 1
        }${this.direction ? 'h' : 'v'} ${this.wordToVerify.join('')}`;
    }

    onKeyBoardClick(event: KeyboardEvent, rack: ICharacter[]) {
        // // console.log(rack);
        const notFound = -1;
        const selectionColor = 'darkorchid';
        const regexp = new RegExp('^[a-zA-Z]$');
        const eventKey = this.verifyService.normalizeWord(event.key);
        // console.log('le key normalisé ', eventKey);
        if (regexp.test(eventKey)) {
            // console.log('je suis rentrée');
            const index = this.getIndexOnRackFromKey(eventKey, rack);
            // console.log('index :', index);
            if (index !== notFound) {
                this.selectedRackIndexesForPlacement.push(index);

                this.rackService.fillRackPortion(index, selectionColor);
                this.selectedTilesForPlacement.push(this.selectedCoord);
                // this.gridService.changeGridStyle(undefined, undefined, selectionColor);
                // this.gridService.squareLineWidth = 1;
                // this.gridService.squareColor = selectionColor;
                this.gridService.squareColor = selectionColor;
                this.gridService.border.squareborder = 'darkorchid';
                this.gridService.writeLetter(eventKey, this.selectedCoord, false);
                //    this.gridService.drawGridPortionBorder(selectionColor, this.selectedCoord, 2);
                const nextCoord = this.direction
                    ? { x: this.selectedCoord.x, y: this.selectedCoord.y + 1 }
                    : { x: this.selectedCoord.x + 1, y: this.selectedCoord.y };
                //  this.gridService.drawGridPortionBorder(selectionColor, nextCoord, 2);
                // // console.log('nextCoord :', nextCoord);
                if (tiles[nextCoord.x][nextCoord.y].text === '' || tiles[nextCoord.x][nextCoord.y].text.length === 2) {
                    this.onBoardClick(
                        {
                            button: 0,
                            offsetX: nextCoord.y * SQUARE_WIDTH,
                            offsetY: nextCoord.x * SQUARE_WIDTH,
                        } as MouseEvent,
                        false,
                    );
                }
            }
        } else
            switch (event.key) {
                case 'Backspace': {
                    this.cancelUniqueSelectionFromRack();
                    this.cancelUniqueBoardClick();

                    break;
                }
                case 'Enter': {
                    this.command = this.buildPlacementCommand(rack);
                    // console.log('la commande ', this.command);

                    break;
                }
                case 'Escape': {
                    this.cancelPlacement();

                    break;
                }
                // No default
            }
    }

    cancelUniqueSelectionFromRack() {
        // console.log(this.selectedRackIndexesForPlacement);
        const toRemove = this.selectedRackIndexesForPlacement.pop();
        this.wordToVerify.pop();
        // console.log(toRemove);
        if (toRemove === undefined) {
            // console.log('dedans');

            return;
        }
        const normalColor = 'NavajoWhite';
        this.rackService.fillRackPortion(toRemove as number, normalColor);
    }

    cancelPlacement() {
        // if (this.selectedTilesForPlacement.length === 0 && this.selectedCoord.x !== -1) {
        //     this.gridService.removeArrow(this.selectedCoord);
        // }
        // console.log(this.selectedCoord);
        while (this.selectedCoord.x !== -1) {
            this.cancelUniqueSelectionFromRack();
            this.cancelUniqueBoardClick();
        }
    }

    onBoardClick(event: MouseEvent, shouldChangeDirection: boolean) {
        const notFound = { x: -1, y: -1 };
        const coord = this.getClickCoords(event);
        if (tiles[7][7].text.length === 2 && (coord.x !== 7 || coord.y !== 7)) {
            return;
        }
        if (!(tiles[coord.x][coord.y].text === '' || tiles[coord.x][coord.y].text.length === 2)) {
            return;
        }

        if (!(this.selectedRackIndexesForPlacement.length === 0 || !shouldChangeDirection === true)) {
            return;
        }
        if (!(coord.x !== notFound.x && coord.y !== notFound.y)) {
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
            //  if (!(this.selectedCoord.x === notFound.x && this.selectedCoord.y === notFound.y)) {
            this.gridService.removeArrow(this.selectedCoord);
            // }

            this.selectedCoord = coord;
        } else {
            // on clique sur le même, on change de direction
            this.direction = !this.direction;
            this.gridService.removeArrow(this.selectedCoord);
        }
        this.gridService.drawArrow(this.direction, this.selectedCoord);

        /*  if (coord.x !== notFound.x && coord.y !== notFound.y) {
            if (coord.x === this.selectedCoord.x && coord.y === this.selectedCoord.y) {
                // on clique sur le même, on change de direction
                this.gridService.removeArrow(this.selectedCoord);
                if (!shouldChangeDirection) {
                    this.direction = !this.direction;
                }
            } else if (this.selectedCoord.x === notFound.x && this.selectedCoord.y === notFound.y) {
                // on clique pour la premiere fois
                this.selectedCoord = coord;
            } else {
                //
                // on clique sur une autre case apres avoir déja cliqué une premiere fois
                if (shouldChangeDirection) {
                    this.direction = true;
                }
                this.gridService.removeArrow(this.selectedCoord);
                this.selectedCoord = coord;

                // if (this.selectedRackIndexesForPlacement.length === 0) {

                //  }
                //  }
            }
            this.gridService.drawArrow(this.direction, this.selectedCoord);
        }*/
    }

    cancelUniqueBoardClick() {
        // console.log(this.selectedTilesForPlacement);
        const coord = this.selectedTilesForPlacement.pop();
        if (this.selectedTilesForPlacement.length === 0 && this.selectedCoord.x !== -1) {
            this.gridService.removeArrow(this.selectedCoord);
        }
        // else if (this.selectedCoord.x !== -1) {
        //     this.gridService.removeArrow(this.selectedCoord);
        // }
        if (coord) {
            // console.log('dehors');
            this.gridService.border.squareborder = 'black';
            this.gridService.removeArrow(this.selectedCoord);
            tiles[coord.x][coord.y].text = tiles[coord.x][coord.y].oldText;
            tiles[coord.x][coord.y].style.color = tiles[coord.x][coord.y].oldStyle.color;
            this.gridService.border.squareborder = 'black';
            this.gridService.fillGridPortion(
                coord,
                tiles[coord.x][coord.y].text,
                tiles[coord.x][coord.y].style.color as string,
                tiles[coord.x][coord.y].style.font as string,
            );
            if (this.direction) {
                this.selectedCoord.y -= 1;
            } else {
                this.selectedCoord.x -= 1;
            }
            this.gridService.drawArrow(this.direction, this.selectedCoord);
        }
        if (this.selectedTilesForPlacement.length === 0) {
            this.gridService.removeArrow(this.selectedCoord);
            this.selectedCoord.x = -1;
            this.selectedCoord.y = -1;
        }
    }
}
