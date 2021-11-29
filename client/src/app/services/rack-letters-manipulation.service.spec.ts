/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { ICharacter } from '@app/classes/letter';
import { NOT_FOUND } from '@app/constants/common-constants';
import { DEFAULT_WIDTH, RACK_SIZE } from '@app/constants/rack-constants';
import { KeyboardKeys } from '@app/enums/keyboard-enum';
import { MouseButton } from '@app/enums/mouse-enums';
import { RackLettersManipulationService } from './rack-letters-manipulation.service';
import { RackService } from './rack.service';
import { SelectionUtilsService } from './selection-utils.service';

describe('RackLettersManipulationService', () => {
    let service: RackLettersManipulationService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let selectionUtilsServiceSpy: jasmine.SpyObj<SelectionUtilsService>;

    beforeEach(() => {
        rackServiceSpy = jasmine.createSpyObj('RackService', ['fillRackPortion', 'isLetterOnRack']);
        selectionUtilsServiceSpy = jasmine.createSpyObj('SelectionUtilsService', ['getSelectedLetters', 'getMouseClickIndex']);

        TestBed.configureTestingModule({
            providers: [
                { provide: RackService, useValue: rackServiceSpy },
                { provide: SelectionUtilsService, useValue: selectionUtilsServiceSpy },
            ],
        });
        service = TestBed.inject(RackLettersManipulationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('cancelManipulation should call fillRackPortionSpy for each letter selected ', () => {
        const firstIndexSelected = 2;
        const secondIndexSelected = 4;
        const selectedIndexes = [firstIndexSelected, secondIndexSelected];

        const expectedCallTimes = 2;
        service.selectedIndexes = selectedIndexes;

        service.cancelManipulation();

        expect(rackServiceSpy.fillRackPortion).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it('cancelManipulation should call delete all selected indexes from the selectedIndexes ', () => {
        const firstIndexSelected = 2;
        const secondIndexSelected = 4;
        const selectedIndexes = [firstIndexSelected, secondIndexSelected];

        const expectedResult = 0;
        service.selectedIndexes = selectedIndexes;

        service.cancelManipulation();

        expect(service.selectedIndexes.length).toEqual(expectedResult);
    });

    it('moveToTheRight should call onMouseLeftClick with the following index', () => {
        const firstIndexSelected = 2;
        const selectedIndexes = [firstIndexSelected];
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.selectedIndexes = selectedIndexes;
        const clickExpected = { offsetX: (firstIndexSelected + 1) * (DEFAULT_WIDTH / RACK_SIZE) + 1 } as MouseEvent;
        const onMouseLeftClickSpy = spyOn(service, 'onMouseLeftClick').and.callThrough();

        // moveToTheRight is private
        // eslint-disable-next-line dot-notation
        service['moveToTheRight'](rack);

        expect(onMouseLeftClickSpy).toHaveBeenCalledWith(clickExpected, rack);
    });

    it('moveToTheRight should return to the first element of the rack', () => {
        const indexSelected = 4;
        const selectedIndexes = [indexSelected];
        const firstIndex = 0;
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.selectedIndexes = selectedIndexes;
        const clickExpected = { offsetX: firstIndex * (DEFAULT_WIDTH / RACK_SIZE) + 1 } as MouseEvent;
        const onMouseLeftClickSpy = spyOn(service, 'onMouseLeftClick').and.callThrough();

        // moveToTheRight is private
        // eslint-disable-next-line dot-notation
        service['moveToTheRight'](rack);

        expect(onMouseLeftClickSpy).toHaveBeenCalledWith(clickExpected, rack);
    });

    it('moveToTheLeft should call onMouseLeftClick with the preceding index', () => {
        const firstIndexSelected = 2;
        const selectedIndexes = [firstIndexSelected];
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.selectedIndexes = selectedIndexes;
        const clickExpected = { offsetX: (firstIndexSelected - 1) * (DEFAULT_WIDTH / RACK_SIZE) + 1 } as MouseEvent;
        const onMouseLeftClickSpy = spyOn(service, 'onMouseLeftClick').and.callThrough();

        // moveToTheLeft is private
        // eslint-disable-next-line dot-notation
        service['moveToTheLeft'](rack);

        expect(onMouseLeftClickSpy).toHaveBeenCalledWith(clickExpected, rack);
    });

    it('moveToTheLeft should call return to the last element of the rack', () => {
        const firstIndexSelected = 0;
        const selectedIndexes = [firstIndexSelected];
        const lastIndex = 4;
        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.selectedIndexes = selectedIndexes;
        const clickExpected = { offsetX: lastIndex * (DEFAULT_WIDTH / RACK_SIZE) + 1 } as MouseEvent;
        const onMouseLeftClickSpy = spyOn(service, 'onMouseLeftClick').and.callThrough();

        // moveToTheLeft is private
        // eslint-disable-next-line dot-notation
        service['moveToTheLeft'](rack);

        expect(onMouseLeftClickSpy).toHaveBeenCalledWith(clickExpected, rack);
    });

    it('getIndexFromKey should return the first occurrence from the left', () => {
        const keyEvent = {
            key: 'b',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        const expectedResult = 1;
        rackServiceSpy.isLetterOnRack.and.returnValue(true);
        selectionUtilsServiceSpy.getSelectedLetters.and.returnValue([]);

        const result = service.getIndexFromKey(keyEvent, rack);

        expect(result).toEqual(expectedResult);
    });

    it('getIndexFromKey should return the second occurrence from the left', () => {
        const keyEvent = {
            key: 'B',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.selectedIndexes = [1];
        const expectedResult = 2;
        rackServiceSpy.isLetterOnRack.and.returnValue(true);
        selectionUtilsServiceSpy.getSelectedLetters.and.returnValue([]);

        const result = service.getIndexFromKey(keyEvent, rack);

        expect(result).toEqual(expectedResult);
    });

    it('getIndexFromKey should return to the first if the second is already selected', () => {
        const keyEvent = {
            key: 'B',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.selectedIndexes = [2];
        const expectedResult = 1;
        rackServiceSpy.isLetterOnRack.and.returnValue(true);
        selectionUtilsServiceSpy.getSelectedLetters.and.returnValue(['b']);

        const result = service.getIndexFromKey(keyEvent, rack);

        expect(result).toEqual(expectedResult);
    });

    it('getIndexFromKey should return to the first element of the rack if the last was the same letter and was selected', () => {
        const keyEvent = {
            key: 'E',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        const selected = 4;
        service.selectedIndexes = [selected];
        const expectedResult = 0;
        rackServiceSpy.isLetterOnRack.and.returnValue(true);
        selectionUtilsServiceSpy.getSelectedLetters.and.returnValue(['e']);

        const result = service.getIndexFromKey(keyEvent, rack);

        expect(result).toEqual(expectedResult);
    });

    it('getIndexFromKey should call cancelManipulation if the letter is not on the rack', () => {
        const keyEvent = {
            key: 'P',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        rackServiceSpy.isLetterOnRack.and.returnValue(false);
        selectionUtilsServiceSpy.getSelectedLetters.and.returnValue([]);

        const cancelManipulationSpy = spyOn(service, 'cancelManipulation').and.callThrough();

        service.getIndexFromKey(keyEvent, rack);

        expect(cancelManipulationSpy).toHaveBeenCalledTimes(1);
    });

    it('onMouseLeftClick should call cancelManipulation if the letter is on the rack but not selected yet', () => {
        const casePosition = 3;
        const event = {
            button: MouseButton.Left,
            offsetX: casePosition * (DEFAULT_WIDTH / RACK_SIZE),
        } as MouseEvent;
        const alreadySelected = 0;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.selectedIndexes = [alreadySelected];
        selectionUtilsServiceSpy.getMouseClickIndex.and.returnValue(casePosition);

        const cancelManipulationSpy = spyOn(service, 'cancelManipulation').and.callThrough();

        service.onMouseLeftClick(event, rack);

        expect(cancelManipulationSpy).toHaveBeenCalledTimes(1);
        expect(service.selectedIndexes).toContain(casePosition);
    });

    it('onMouseLeftClick should call fillRackPortion if the letter is on the rack but not selected yet', () => {
        const casePosition = 3;
        const event = {
            button: MouseButton.Left,
            offsetX: casePosition * (DEFAULT_WIDTH / RACK_SIZE),
        } as MouseEvent;
        const alreadySelected = 0;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.selectedIndexes = [alreadySelected];
        selectionUtilsServiceSpy.getMouseClickIndex.and.returnValue(casePosition);

        service.onMouseLeftClick(event, rack);

        expect(rackServiceSpy.fillRackPortion).toHaveBeenCalled();
        expect(service.selectedIndexes).toContain(casePosition);
    });

    it('onKeyBoardClick should get the right function from map', () => {
        let flagToCheck = NOT_FOUND;
        service.moveOperationMapping = new Map([
            [
                KeyboardKeys.ArrowLeft,
                () => {
                    flagToCheck = 0;
                },
            ],
            [
                KeyboardKeys.ArrowRight,
                () => {
                    flagToCheck = 1;
                },
            ],
        ]);
        const casePosition = 3;
        const keyEvent = {
            key: KeyboardKeys.ArrowLeft,
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        selectionUtilsServiceSpy.getMouseClickIndex.and.returnValue(casePosition);

        service.onKeyBoardClick(keyEvent, rack);

        expect(flagToCheck).toEqual(0);
    });

    it('onKeyBoardClick should call handleLetterKeySelection', () => {
        let flagToCheck = NOT_FOUND;
        service.moveOperationMapping = new Map([
            [
                KeyboardKeys.ArrowLeft,
                () => {
                    flagToCheck = 0;
                },
            ],
            [
                KeyboardKeys.ArrowRight,
                () => {
                    flagToCheck = 1;
                },
            ],
        ]);
        const casePosition = 3;
        const keyEvent = {
            key: 'p',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        selectionUtilsServiceSpy.getMouseClickIndex.and.returnValue(casePosition);

        // handleLetterKeySelection is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handleLetterKeySelectionSpy = spyOn<any>(service, 'handleLetterKeySelection').and.callThrough();

        service.onKeyBoardClick(keyEvent, rack);

        expect(flagToCheck).toEqual(NOT_FOUND);
        expect(handleLetterKeySelectionSpy).toHaveBeenCalled();
    });

    it('handleLetterKeySelection should call fillRackPortion if the letter is on the rack but not selected yet', () => {
        const casePosition = 3;
        const event = {
            button: MouseButton.Left,
            offsetX: casePosition * (DEFAULT_WIDTH / RACK_SIZE),
        } as MouseEvent;
        const alreadySelected = 0;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.selectedIndexes = [alreadySelected];
        selectionUtilsServiceSpy.getMouseClickIndex.and.returnValue(casePosition);

        service.onMouseLeftClick(event, rack);

        expect(rackServiceSpy.fillRackPortion).toHaveBeenCalled();
        expect(service.selectedIndexes).toContain(casePosition);
    });

    it('handleLetterKeySelection should call getIndexFromKey', () => {
        const keyEvent = {
            key: 'p',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        const getIndexFromKeySpy = spyOn(service, 'getIndexFromKey').and.callThrough();
        // handleLetterKeySelection is private
        // eslint-disable-next-line dot-notation
        service['handleLetterKeySelection'](keyEvent, rack);

        expect(getIndexFromKeySpy).toHaveBeenCalledTimes(1);
    });

    it('handleLetterKeySelection should call manipulationSteps', () => {
        const keyEvent = {
            key: 'p',
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        // manipulationSteps is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const manipulationStepsSpy = spyOn<any>(service, 'manipulationSteps').and.callThrough();

        // handleLetterKeySelection is private
        // eslint-disable-next-line dot-notation
        service['handleLetterKeySelection'](keyEvent, rack);

        expect(manipulationStepsSpy).toHaveBeenCalledTimes(1);
    });

    it('getIndexFromKey should set service.shiftKey to true if it is the first time', () => {
        const keyEvent = {
            key: '*',
            shiftKey: true,
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.shiftKey = false;
        // handleLetterKeySelection is private
        // eslint-disable-next-line dot-notation
        service['handleLetterKeySelection'](keyEvent, rack);

        service.getIndexFromKey(keyEvent, rack);

        expect(service.shiftKey).toEqual(true);
    });

    it('getIndexFromKey should set service.shiftKey to false if the key is shift and it is the second time', () => {
        const keyEvent = {
            key: 'shift',
            shiftKey: true,
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.shiftKey = true;

        service.getIndexFromKey(keyEvent, rack);

        expect(service.shiftKey).toEqual(false);
    });

    it('getIndexFromKey should set service.shiftKey to false if the key is shift and it is the second time', () => {
        const keyEvent = {
            key: 'shift',
            shiftKey: true,
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];

        service.shiftKey = true;

        service.getIndexFromKey(keyEvent, rack);

        expect(service.shiftKey).toEqual(false);
    });

    it('getIndexFromKey should call cancelManipulation if shift key has not been pressed in purpose to click *', () => {
        const keyEvent = {
            key: 'shift',
            shiftKey: false,
            preventDefault: () => void '',
        } as KeyboardEvent;

        const rack: ICharacter[] = [
            { name: 'E', quantity: 15, points: 1, display: 'E' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];
        const cancelManipulationSpy = spyOn(service, 'cancelManipulation').and.callThrough();

        service.shiftKey = false;

        service.getIndexFromKey(keyEvent, rack);

        expect(cancelManipulationSpy).toHaveBeenCalledTimes(1);
    });

    describe('onKeyBoardClick', () => {
        let moveToTheLeftSpy: jasmine.Spy<() => void>;
        let moveToTheRightSpy: jasmine.Spy<() => void>;
        let flagToCheck: string;

        beforeEach(() => {
            service = TestBed.inject(RackLettersManipulationService);
            flagToCheck = 'NOT_FOUND';
            // moveToTheLeft is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            moveToTheLeftSpy = spyOn<any>(service, 'moveToTheLeft').and.callFake(() => {
                flagToCheck = 'moveToTheLeft';
            });
            // moveToTheRight is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            moveToTheRightSpy = spyOn<any>(service, 'moveToTheRight').and.callFake(() => {
                flagToCheck = 'moveToTheRight';
            });
        });

        it('onKeyBoardClick should move to the left', () => {
            flagToCheck = 'NOT_FOUND';
            const keyEvent = {
                key: KeyboardKeys.ArrowLeft,
                preventDefault: () => void '',
            } as KeyboardEvent;

            const rack: ICharacter[] = [
                { name: 'E', quantity: 15, points: 1, display: 'E' },
                { name: 'B', quantity: 0, points: 3, display: 'B' },
                { name: 'B', quantity: 0, points: 3, display: 'B' },
                { name: 'D', quantity: 3, points: 2, display: 'D' },
                { name: 'E', quantity: 15, points: 1, display: 'E' },
            ];

            service.onKeyBoardClick(keyEvent, rack);

            expect(flagToCheck).toEqual('moveToTheLeft');
            expect(moveToTheLeftSpy).toHaveBeenCalled();
            expect(moveToTheRightSpy).not.toHaveBeenCalled();
        });

        it('onKeyBoardClick should move to the right', () => {
            flagToCheck = 'NOT_FOUND';
            const keyEvent = {
                key: KeyboardKeys.ArrowRight,
                preventDefault: () => void '',
            } as KeyboardEvent;

            const rack: ICharacter[] = [
                { name: 'E', quantity: 15, points: 1, display: 'E' },
                { name: 'B', quantity: 0, points: 3, display: 'B' },
                { name: 'B', quantity: 0, points: 3, display: 'B' },
                { name: 'D', quantity: 3, points: 2, display: 'D' },
                { name: 'E', quantity: 15, points: 1, display: 'E' },
            ];

            service.onKeyBoardClick(keyEvent, rack);

            expect(flagToCheck).toEqual('moveToTheRight');
            expect(moveToTheLeftSpy).not.toHaveBeenCalled();
            expect(moveToTheRightSpy).toHaveBeenCalled();
        });

        it('onKeyBoardClick should not get the right function', () => {
            flagToCheck = 'NOT_FOUND';
            const keyEvent = {
                key: KeyboardKeys.Backspace,
                preventDefault: () => void '',
            } as KeyboardEvent;

            const rack: ICharacter[] = [
                { name: 'E', quantity: 15, points: 1, display: 'E' },
                { name: 'B', quantity: 0, points: 3, display: 'B' },
                { name: 'B', quantity: 0, points: 3, display: 'B' },
                { name: 'D', quantity: 3, points: 2, display: 'D' },
                { name: 'E', quantity: 15, points: 1, display: 'E' },
            ];

            service.onKeyBoardClick(keyEvent, rack);

            expect(flagToCheck).toEqual('NOT_FOUND');
            expect(moveToTheLeftSpy).not.toHaveBeenCalled();
            expect(moveToTheRightSpy).not.toHaveBeenCalled();
        });
    });
});
