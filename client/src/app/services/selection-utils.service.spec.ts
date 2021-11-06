import { TestBed } from '@angular/core/testing';
import { ICharacter } from '@app/classes/letter';
import { NOT_FOUND } from '@app/constants/common-constants';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { MouseButton } from '@app/enums/mouse-enums';
import { SelectionUtilsService } from './selection-utils.service';

describe('SelectionUtilsService', () => {
    let service: SelectionUtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionUtilsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getSelectedLetters should return all selected letters in string', () => {
        const firstIndexSelected = 2;
        const secondIndexSelected = 4;
        const selectedIndexes = [firstIndexSelected, secondIndexSelected];
        const expectedResult = ['b', 'e'];
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        const result = service.getSelectedLetters(rack, selectedIndexes);

        expect(result).toEqual(expectedResult);
    });

    it('getMouseClickIndex should return not found', () => {
        const casPosition = 8;
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        const event = {
            button: MouseButton.Right,
            offsetX: casPosition * (DEFAULT_WIDTH / RACK_SIZE),
        } as MouseEvent;

        const result = service.getMouseClickIndex(event, rack);
        expect(result).toEqual(NOT_FOUND);
    });

    it('getClickIndex should return the letter index on the rack', () => {
        const expectedResult = 2;
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];
        const event = {
            button: MouseButton.Right,
            offsetX: expectedResult * (DEFAULT_WIDTH / RACK_SIZE),
        } as MouseEvent;

        const result = service.getMouseClickIndex(event, rack);
        expect(result).toEqual(expectedResult);
    });
});
