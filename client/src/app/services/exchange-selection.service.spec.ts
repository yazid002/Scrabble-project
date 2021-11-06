import { TestBed } from '@angular/core/testing';
import { ICharacter } from '@app/classes/letter';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { MouseButton } from '@app/enums/mouse-enums';
import { ExchangeSelectionService } from './exchange-selection.service';
import { RackService } from './rack.service';
import { SelectionUtilsService } from './selection-utils.service';

describe('ExchangeSelectionService', () => {
    let service: ExchangeSelectionService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let selectionUtilsServiceSpy: jasmine.SpyObj<SelectionUtilsService>;

    beforeEach(() => {
        rackServiceSpy = jasmine.createSpyObj('RackService', ['fillRackPortion']);
        selectionUtilsServiceSpy = jasmine.createSpyObj('SelectionUtilsService', ['getSelectedLetters', 'getMouseClickIndex']);

        TestBed.configureTestingModule({
            providers: [
                { provide: RackService, useValue: rackServiceSpy },
                { provide: SelectionUtilsService, useValue: selectionUtilsServiceSpy },
            ],
        });
        service = TestBed.inject(ExchangeSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('hideOperation return true if there is no letter selected for exchange', () => {
        service.selectedIndexes = [];
        const result = service.hideOperation();
        expect(result).toEqual(true);
    });

    it('hideOperation should return false if there is at least one letter selected for exchange', () => {
        service.selectedIndexes = [2];
        const result = service.hideOperation();
        expect(result).toEqual(false);
    });

    it('isLetterAlreadySelected should return true if the letter index is selected', () => {
        const indexToCheck = 1;
        service.selectedIndexes = [2, 1];
        const result = service.isLetterAlreadySelected(indexToCheck);
        expect(result).toEqual(true);
    });

    it('isLetterAlreadySelected should return false if the letter index is not selected', () => {
        const indexToCheck = 1;
        service.selectedIndexes = [2, 0];
        const result = service.isLetterAlreadySelected(indexToCheck);
        expect(result).toEqual(false);
    });

    it('buildExchangeCommand should build the exchange command with the selected letters', () => {
        const firstIndexSelected = 2;
        const secondIndexSelected = 4;
        const selectedIndexes = [firstIndexSelected, secondIndexSelected];
        const expectedResult = '!echanger be';
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
        ];

        service.selectedIndexes = selectedIndexes;
        selectionUtilsServiceSpy.getSelectedLetters.and.returnValue(['b', 'e']);

        const result = service.buildExchangeCommand(rack);

        expect(result).toEqual(expectedResult);
    });

    it('cancelExchange should call fillRackPortionSpy for each letter selected ', () => {
        const firstIndexSelected = 2;
        const secondIndexSelected = 4;
        const selectedIndexes = [firstIndexSelected, secondIndexSelected];

        const expectedCallTimes = 2;
        service.selectedIndexes = selectedIndexes;

        service.cancelExchange();

        expect(rackServiceSpy.fillRackPortion).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('cancelExchange should call delete all selected indexes from the selectedIndexes ', () => {
        const firstIndexSelected = 2;
        const secondIndexSelected = 4;
        const selectedIndexes = [firstIndexSelected, secondIndexSelected];

        const expectedResult = 0;
        service.selectedIndexes = selectedIndexes;

        service.cancelExchange();

        expect(service.selectedIndexes.length).toEqual(expectedResult);
    });

    it('onMouseRightClick should call fillRackPortionSpy ', () => {
        const casPosition = 8;
        const firstIndexSelected = 2;
        const secondIndexSelected = 4;
        const selectedIndexes = [firstIndexSelected, secondIndexSelected];
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
        ];

        const expectedCallTimes = 1;
        service.selectedIndexes = selectedIndexes;

        const event = {
            button: MouseButton.Right,
            offsetX: casPosition * (DEFAULT_WIDTH / RACK_SIZE),
        } as MouseEvent;

        service.onMouseRightClick(event, rack);

        expect(rackServiceSpy.fillRackPortion).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('onMouseRightClick should call getClickIndex ', () => {
        const casPosition = 8;
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
        ];

        const expectedCallTimes = 1;
        service.selectedIndexes = [];

        const event = {
            button: MouseButton.Right,
            offsetX: casPosition * (DEFAULT_WIDTH / RACK_SIZE),
        } as MouseEvent;

        service.onMouseRightClick(event, rack);

        expect(selectionUtilsServiceSpy.getMouseClickIndex).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('onMouseRightClick should select the letter clicked ', () => {
        const casePosition = 3;
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
        ];

        selectionUtilsServiceSpy.getMouseClickIndex.and.returnValue(casePosition);

        service.selectedIndexes = [];

        const event = {
            button: MouseButton.Right,
            offsetX: casePosition * (DEFAULT_WIDTH / RACK_SIZE),
        } as MouseEvent;

        service.onMouseRightClick(event, rack);

        expect(service.selectedIndexes).toContain(casePosition);
    });

    it('onMouseRightClick should cancel the selection clicked ', () => {
        const casePosition = 4;
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'B', quantity: 0, points: 3, affiche: 'B' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
        ];

        selectionUtilsServiceSpy.getMouseClickIndex.and.returnValue(casePosition);

        service.selectedIndexes = [casePosition];

        const event = {
            button: MouseButton.Right,
            offsetX: casePosition * (DEFAULT_WIDTH / RACK_SIZE),
        } as MouseEvent;

        service.onMouseRightClick(event, rack);

        expect(service.selectedIndexes).not.toContain(casePosition);
    });
});
