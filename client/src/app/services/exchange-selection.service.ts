import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { NOT_FOUND } from '@app/constants/common-constants';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { RackService } from './rack.service';

@Injectable({
    providedIn: 'root',
})
export class ExchangeSelectionService {
    selectedIndexes: number[] = [];
    constructor(private rackService: RackService) {}

    onMouseRightClick(event: MouseEvent, rack: ICharacter[]) {
        const normalColor = 'NavajoWhite';
        const selectionColor = 'blue';
        const index = this.getClickIndex(event, rack);
        const included = this.selectedIndexes.includes(index);

        if (included) {
            this.selectedIndexes = this.selectedIndexes.filter((elem) => {
                return elem !== index;
            });
            this.rackService.fillRackPortion(index, normalColor);
        } else {
            this.selectedIndexes.push(index);
            this.rackService.fillRackPortion(index, selectionColor);
        }
    }

    cancelExchange() {
        const normalColor = 'NavajoWhite';
        for (const index of this.selectedIndexes) {
            this.rackService.fillRackPortion(index, normalColor);
        }
        this.selectedIndexes = [];
    }

    buildExchangeCommand(rack: ICharacter[]): string {
        const lettersToExchange = this.getSelectedLetters(rack);
        return `!echanger ${lettersToExchange.join('')}`;
    }

    getSelectedLetters(rack: ICharacter[]): string[] {
        const selectedLetters = [];
        for (const index of this.selectedIndexes) {
            selectedLetters.push(rack[index].name.toLocaleLowerCase());
        }
        return selectedLetters;
    }

    getClickIndex(event: MouseEvent, rack: ICharacter[]): number {
        for (let i = 0; i < rack.length; i++) {
            if (event.offsetX >= i * (DEFAULT_WIDTH / RACK_SIZE) && event.offsetX < (i + 1) * (DEFAULT_WIDTH / RACK_SIZE)) {
                return i;
            }
        }
        return NOT_FOUND;
    }

    isSelectionInProgress(): boolean {
        return this.selectedIndexes.length !== 0;
    }

    isLetterAlreadySelected(index: number): boolean {
        return this.selectedIndexes.includes(index);
    }

    hideOperation() {
        return this.selectedIndexes.length === 0;
    }
}
