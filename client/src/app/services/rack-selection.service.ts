import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { RackService } from './rack.service';

@Injectable({
    providedIn: 'root',
})
export class RackSelectionService {
    selectedIndexes: number[] = [];
    selectedIndexesForExchange: number[] = [];
    selectedIndexesForPlacement: number[] = [];
    selectedIndexesForManipulation: number[] = [];
    constructor(private rackService: RackService) {}

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

    getSelectedLetters(rack: ICharacter[]): string[] {
        const selectedLetters = [];
        for (const index of this.selectedIndexes) {
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
}
