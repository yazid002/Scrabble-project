import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { NOT_FOUND } from '@app/constants/common-constants';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { RackService } from './rack.service';

@Injectable({
    providedIn: 'root',
})
export class RackLettersManipulationService {
    selectedIndexes: number[] = [];
    selectedIndex: number = NOT_FOUND;
    shiftKey: boolean = false;
    constructor(private rackService: RackService) {}

    getIndexFromKey(event: KeyboardEvent, rack: ICharacter[]) {
        const letterToFound = event.key.toLowerCase();

        const selectedLetters = this.getSelectedLetters(rack);

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

    onMouseLeftClick(event: MouseEvent, rack: ICharacter[]) {
        const selectionColor = 'violet';
        const index = this.getMouseClickIndex(event, rack);
        const included = this.selectedIndexes.includes(index);

        if (!included && index !== NOT_FOUND) {
            this.cancelManipulation();

            this.selectedIndexes[0] = index;
            this.rackService.fillRackPortion(index, selectionColor);
        }
    }

    onKeyBoardClick(event: KeyboardEvent, rack: ICharacter[]) {
        const selectionColor = 'violet';

        if (event.key === 'ArrowRight') {
            this.moveToTheRight(rack);
        } else if (event.key === 'ArrowLeft') {
            this.moveToTheLeft(rack);
        } else {
            const index = this.getIndexFromKey(event, rack);
            const included = this.selectedIndexes.includes(index);
            if (!included && index !== NOT_FOUND) {
                this.cancelManipulation();
                this.selectedIndexes[0] = index;
                this.rackService.fillRackPortion(index, selectionColor);
            }
        }
    }

    cancelManipulation() {
        const normalColor = 'NavajoWhite';
        for (const index of this.selectedIndexes) {
            this.rackService.fillRackPortion(index, normalColor);
        }

        this.selectedIndexes = [];
        return NOT_FOUND;
    }

    getMouseClickIndex(event: MouseEvent, rack: ICharacter[]): number {
        for (let i = 0; i < rack.length; i++) {
            if (event.offsetX >= i * (DEFAULT_WIDTH / RACK_SIZE) * 1 && event.offsetX < (i + 1) * (DEFAULT_WIDTH / RACK_SIZE) * 1) {
                return i;
            }
        }
        return NOT_FOUND;
    }

    getSelectedLetters(rack: ICharacter[]): string[] {
        const selectedLetters: string[] = [];
        for (const index of this.selectedIndexes) {
            selectedLetters[0] = rack[index].name.toLowerCase();
        }
        return selectedLetters;
    }

    moveToTheRight(rack: ICharacter[]) {
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

    moveToTheLeft(rack: ICharacter[]) {
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
}
