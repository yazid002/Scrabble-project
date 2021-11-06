import { Injectable } from '@angular/core';
import { ICharacter } from '@app/classes/letter';
import { NOT_FOUND } from '@app/constants/common-constants';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';

@Injectable({
    providedIn: 'root',
})
export class SelectionUtilsService {
    getMouseClickIndex(event: MouseEvent, rack: ICharacter[]): number {
        for (let i = 0; i < rack.length; i++) {
            if (event.offsetX >= i * (DEFAULT_WIDTH / RACK_SIZE) * 1 && event.offsetX < (i + 1) * (DEFAULT_WIDTH / RACK_SIZE) * 1) {
                return i;
            }
        }
        return NOT_FOUND;
    }

    getSelectedLetters(rack: ICharacter[], selectedIndexes: number[]): string[] {
        const selectedLetters = [];
        for (const index of selectedIndexes) {
            selectedLetters.push(rack[index].name.toLocaleLowerCase());
        }
        return selectedLetters;
    }
}
