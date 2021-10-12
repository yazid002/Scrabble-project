import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { RackService } from './rack.service';

@Injectable({
    providedIn: 'root',
})
export class RackLettersManipulationService {
    selectedIndexes: number[] = [];
    //  selectedLetters: string[] = [];
    selectedIndex: number = -1;
    constructor(private rackService: RackService) {}

    getIndexFromKey(event: KeyboardEvent, rack: ICharacter[]) {
        const notFound = -1;
        const letterToFound = event.key === event.key.toUpperCase() ? '*' : event.key;

        const selectedLetters = this.getSelectedLetters(rack);
        console.log('f1 :', selectedLetters);

        const lastOccurrence = selectedLetters.lastIndexOf(letterToFound);
        console.log('lastOccurrence : ', lastOccurrence);
        let i = 0;
        if (lastOccurrence !== -1) {
            i = this.selectedIndexes[lastOccurrence] + 1 === rack.length ? 0 : this.selectedIndexes[lastOccurrence] + 1;
            console.log('index : ', this.selectedIndexes[lastOccurrence]);
        }

        console.log('i : ', i);

        while (i < rack.length) {
            console.log('i2 : ', i);
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
        return notFound;
    }

    onMouseLeftClick(event: MouseEvent, rack: ICharacter[]) {
        const selectionColor = 'violet';
        const index = this.getMouseClickIndex(event, rack);
        const included = this.selectedIndexes.includes(index);

        console.log(this.selectedIndexes);
        console.log(included);
        if (!included && index !== -1) {
            this.selectedIndexes.push(index);
            this.rackService.fillRackPortion(index, selectionColor);
            console.log(this.selectedIndexes);
        }
    }

    onKeyBoardClick(event: KeyboardEvent, rack: ICharacter[]) {
        const selectionColor = 'violet';
        const index = this.getIndexFromKey(event, rack);
        const included = this.selectedIndexes.includes(index);

        console.log(this.selectedIndexes);
        console.log(included);

        if (!included && index !== -1) {
            this.selectedIndexes.push(index);
            this.rackService.fillRackPortion(index, selectionColor);
            console.log(this.selectedIndexes);
        }
    }

    cancelManipulation() {
        const normalColor = 'NavajoWhite';
        for (const index of this.selectedIndexes) {
            this.rackService.fillRackPortion(index, normalColor);
        }

        this.selectedIndexes = [];
    }

    getMouseClickIndex(event: MouseEvent, rack: ICharacter[]): number {
        console.log('{ x, y} :', event.offsetX, event.offsetY);
        const notFound = -1;
        for (let i = 0; i < rack.length; i++) {
            if (event.offsetX >= i * (DEFAULT_WIDTH / RACK_SIZE) * 1 && event.offsetX < (i + 1) * (DEFAULT_WIDTH / RACK_SIZE) * 1) {
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
}
