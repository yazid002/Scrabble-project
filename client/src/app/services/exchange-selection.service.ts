import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { RackService } from './rack.service';
import { SelectionUtilsService } from './selection-utils.service';

@Injectable({
    providedIn: 'root',
})
export class ExchangeSelectionService {
    selectedIndexes: number[] = [];
    constructor(private rackService: RackService, private selectionUtilsService: SelectionUtilsService) {}

    onMouseRightClick(event: MouseEvent, rack: ICharacter[]): void {
        const normalColor = 'NavajoWhite';
        const selectionColor = 'DeepSkyBlue';
        const index = this.selectionUtilsService.getMouseClickIndex(event, rack);
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

    cancelExchange(): void {
        const normalColor = 'NavajoWhite';
        for (const index of this.selectedIndexes) {
            this.rackService.fillRackPortion(index, normalColor);
        }
        this.selectedIndexes = [];
    }

    buildExchangeCommand(rack: ICharacter[]): string {
        const lettersToExchange = this.selectionUtilsService.getSelectedLetters(rack, this.selectedIndexes);
        return `!echanger ${lettersToExchange.join('')}`;
    }

    // getSelectedLetters(rack: ICharacter[]): string[] {
    //     const selectedLetters = [];
    //     for (const index of this.selectedIndexes) {
    //         selectedLetters.push(rack[index].name.toLocaleLowerCase());
    //     }
    //     return selectedLetters;
    // }

    isLetterAlreadySelected(index: number): boolean {
        return this.selectedIndexes.includes(index);
    }

    hideOperation(): boolean {
        return this.selectedIndexes.length === 0;
    }
}
