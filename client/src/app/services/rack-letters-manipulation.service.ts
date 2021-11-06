import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { NOT_FOUND } from '@app/constants/common-constants';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { KeyboardKeys } from '@app/enums/keyboard-enum';
import { RackService } from './rack.service';
import { SelectionUtilsService } from './selection-utils.service';

@Injectable({
    providedIn: 'root',
})
export class RackLettersManipulationService {
    selectedIndexes: number[];
    selectedIndex: number;
    shiftKey: boolean;
    moveOperationMapping: Map<string, (rack: ICharacter[]) => void>;
    constructor(private rackService: RackService, private selectionUtilsService: SelectionUtilsService) {
        this.selectedIndexes = [];
        this.selectedIndex = NOT_FOUND;
        this.shiftKey = false;
        this.moveOperationMapping = new Map([
            [KeyboardKeys.ArrowLeft, (rack: ICharacter[]) => this.moveToTheLeft(rack)],
            [KeyboardKeys.ArrowRight, (rack: ICharacter[]) => this.moveToTheRight(rack)],
        ]);
    }

    getIndexFromKey(event: KeyboardEvent, rack: ICharacter[]): number {
        const letterToFound = event.key.toLowerCase();

        const selectedLetters = this.selectionUtilsService.getSelectedLetters(rack, this.selectedIndexes);

        if (event.shiftKey) {
            this.shiftKey = true;
        }
        if (letterToFound === 'shift') {
            if (this.shiftKey) {
                this.shiftKey = false;
                return this.selectedIndexes[0];
            } else {
                return this.cancelManipulation();
            }
        }

        if (!this.rackService.isLetterOnRack(letterToFound, rack)) {
            return this.cancelManipulation();
        }

        const lastOccurrence = selectedLetters.lastIndexOf(letterToFound);

        let i = 0;
        if (lastOccurrence !== NOT_FOUND) {
            i = this.selectedIndexes[lastOccurrence] + 1 === rack.length ? 0 : this.selectedIndexes[lastOccurrence] + 1;
        }

        while (i < rack.length) {
            if (rack[i].name === letterToFound.toUpperCase()) {
                if (!this.selectedIndexes.includes(i) || i === this.selectedIndexes[lastOccurrence]) {
                    return i;
                }
            }
            i++;
            if (i === rack.length) {
                i = 0;
            }
        }
        return NOT_FOUND;
    }

    onMouseLeftClick(event: MouseEvent, rack: ICharacter[]): void {
        const index = this.selectionUtilsService.getMouseClickIndex(event, rack);
        this.manipulationSteps(index);
    }

    onKeyBoardClick(event: KeyboardEvent, rack: ICharacter[]): void {
        const moveOperation = this.moveOperationMapping.get(event.key);
        if (moveOperation) {
            return moveOperation(rack);
        }
        return this.handleLetterKeySelection(event, rack);
    }
    cancelManipulation(): number {
        const normalColor = 'NavajoWhite';
        for (const index of this.selectedIndexes) {
            this.rackService.fillRackPortion(index, normalColor);
        }

        this.selectedIndexes = [];
        return NOT_FOUND;
    }

    private moveToTheRight(rack: ICharacter[]): void {
        let toIndex = this.selectedIndexes[0] + 1;
        if (this.selectedIndexes[0] === rack.length - 1) {
            toIndex = 0;
        }

        const temp = rack[this.selectedIndexes[0]];
        rack[this.selectedIndexes[0]] = rack[toIndex];
        rack[toIndex] = temp;
        this.cancelManipulation();
        const click = { offsetX: toIndex * (DEFAULT_WIDTH / RACK_SIZE) + 1 } as MouseEvent;
        this.onMouseLeftClick(click, rack);
    }

    private moveToTheLeft(rack: ICharacter[]): void {
        let toIndex = this.selectedIndexes[0] - 1;
        if (this.selectedIndexes[0] === 0) {
            toIndex = rack.length - 1;
        }

        const temp = rack[this.selectedIndexes[0]];
        rack[this.selectedIndexes[0]] = rack[toIndex];
        rack[toIndex] = temp;
        this.cancelManipulation();
        const click = { offsetX: toIndex * (DEFAULT_WIDTH / RACK_SIZE) + 1 } as MouseEvent;
        this.onMouseLeftClick(click, rack);
    }

    private handleLetterKeySelection(event: KeyboardEvent, rack: ICharacter[]): void {
        const index = this.getIndexFromKey(event, rack);
        this.manipulationSteps(index);
    }

    private manipulationSteps(index: number): void {
        const selectionColor = 'LightSalmon';
        const included = this.selectedIndexes.includes(index);
        if (!included && index !== NOT_FOUND) {
            this.cancelManipulation();
            this.selectedIndexes[0] = index;
            this.rackService.fillRackPortion(index, selectionColor);
        }
    }
}
