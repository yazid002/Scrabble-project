import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';

@Injectable({
    providedIn: 'root',
})
export class RackSelectionService {
    selectedIndexes: number[] = [];
    // constructor() {}

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
        const included = this.selectedIndexes.includes(index);

        console.log(this.selectedIndexes);
        console.log(included);
        if (included) {
            this.selectedIndexes = this.selectedIndexes.filter((elem) => {
                console.log(elem);
                console.log(index);
                return elem !== index;
            });
            console.log(this.selectedIndexes);
            this.rackService.fillRackPortion(index, normalColor);
        } else {
            this.selectedIndexes.push(index);
            this.rackService.fillRackPortion(index, selectionColor);
            console.log(this.selectedIndexes);
        }
    }
}
