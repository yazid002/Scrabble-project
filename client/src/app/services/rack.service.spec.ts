/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { RackService } from './rack.service';
import { ReserveService } from './reserve.service';

describe('RackService', () => {
    let service: RackService;
    let reserveServiceSpy: jasmine.SpyObj<ReserveService>;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;

    beforeEach(() => {
        reserveServiceSpy = jasmine.createSpyObj('ReserveService', ['getQuantityOfAvailableLetters', 'getLettersFromReserve', 'addLetterInReserve']);
        reserveServiceSpy.alphabets = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 2, points: 3, affiche: 'B' },
            { name: 'C', quantity: 2, points: 3, affiche: 'C' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
            { name: 'F', quantity: 2, points: 4, affiche: 'F' },
            { name: 'G', quantity: 2, points: 4, affiche: 'G' },
            { name: 'H', quantity: 2, points: 4, affiche: 'H' },
        ];
        TestBed.configureTestingModule({ providers: [{ provide: ReserveService, useValue: reserveServiceSpy }] });
        service = TestBed.inject(RackService);
        service.rackLetters = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 2, points: 3, affiche: 'B' },
            { name: 'C', quantity: 2, points: 3, affiche: 'C' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
        ];
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.rackContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('isLetterOnRack', () => {
        it('isLetterOnRack should call findLetterPosition', () => {
            const letterToCheck = 'B';
            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const findLetterPositionSpy = spyOn<any>(service, 'findLetterPosition').and.callThrough();

            service.isLetterOnRack(letterToCheck);

            // Car findLetterPosition est privée
            // eslint-disable-next-line dot-notation
            expect(findLetterPositionSpy).toHaveBeenCalled();
        });

        it('should return true', () => {
            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findLetterPosition').and.returnValue(2);
            const letterToCheck = 'B';

            const result = service.isLetterOnRack(letterToCheck);

            expect(result).toBeTrue();
        });

        it('should return false', () => {
            const notFound = -1;
            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findLetterPosition').and.returnValue(notFound);
            const letterToCheck = 'Z';

            const result = service.isLetterOnRack(letterToCheck);

            expect(result).toBeFalse();
        });
    });

    describe('findLetterPosition', () => {
        it('should return notFound', () => {
            const notFound = -1;
            const letterToCheck = 'Z';

            // Car findLetterPosition est privée
            // eslint-disable-next-line dot-notation
            const result = service['findLetterPosition'](letterToCheck);

            expect(result).toEqual(notFound);
        });

        it('should return the letter position', () => {
            const position = 0;
            const letterToCheck = 'A';

            // Car findLetterPosition est privée
            // eslint-disable-next-line dot-notation
            const result = service['findLetterPosition'](letterToCheck);

            expect(result).toEqual(position);
        });
    });

    it('findInexistentLettersOnRack should return all lettersToChange that are not on the rack', () => {
        const lettersToChange: string[] = ['B', 'U', 'D'];

        const isLetterOnRackSpy = spyOn(service, 'isLetterOnRack')
            .withArgs(lettersToChange[0])
            .and.returnValue(true)
            .withArgs(lettersToChange[1])
            .and.returnValue(false)
            .withArgs(lettersToChange[2])
            .and.returnValue(true);

        const expectedResult = ['U'];

        // eslint-disable-next-line dot-notation
        const result = service['findInexistentLettersOnRack'](lettersToChange);

        expect(isLetterOnRackSpy).toHaveBeenCalledTimes(lettersToChange.length);
        expect(result).toEqual(expectedResult);
    });

    describe('findJokersNumberOnRack', () => {
        it('should return the number of jokers on Rack', () => {
            service.rackLetters = [
                { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                { name: '*', quantity: 0, points: 0, affiche: '*' },
                { name: '*', quantity: 0, points: 0, affiche: '*' },
                { name: 'D', quantity: 3, points: 2, affiche: 'D' },
                { name: 'E', quantity: 15, points: 1, affiche: 'E' },
            ];
            const expectedResult = 2;

            const result = service.findJokersNumberOnRack();

            expect(result).toEqual(expectedResult);
        });

        it('should return 0 if there is no joker on Rack', () => {
            service.rackLetters = [
                { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                { name: 'D', quantity: 3, points: 2, affiche: 'D' },
                { name: 'E', quantity: 15, points: 1, affiche: 'E' },
            ];
            const expectedResult = 0;

            const result = service.findJokersNumberOnRack();

            expect(result).toEqual(expectedResult);
        });
    });

    describe('countLetterOccurrences', () => {
        it('should return the number of occurrences of the specified letter in the array of letters', () => {
            const lettersForTest: string[] = ['B', 'B', 'B', 'G'];
            const letterToCheck = 'B';
            const expectedResult = 3;

            const result = service.countLetterOccurrences(letterToCheck, lettersForTest);

            expect(result).toEqual(expectedResult);
        });

        it('should return 0 if there is no occurrence of the specified letter', () => {
            const lettersForTest: string[] = ['B', 'B', 'B', 'G'];
            const letterToCheck = 'C';
            const expectedResult = 0;

            const result = service.countLetterOccurrences(letterToCheck, lettersForTest);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('checkLettersAvailability', () => {
        it('should call getQuantityOfAvailableLetters of reserveServiceSpy', () => {
            const LIMIT = 5;

            service.checkLettersAvailability(LIMIT);

            expect(reserveServiceSpy.getQuantityOfAvailableLetters).toHaveBeenCalled();
        });

        it('should return true if there is enough letters in the reserve of reserveServiceSpy', () => {
            const expectedResult = true;

            const LIMIT = 5;
            const FALSE_NUMBER_OF_AVAILABLE_LETTERS = 10;
            reserveServiceSpy.getQuantityOfAvailableLetters.and.returnValue(FALSE_NUMBER_OF_AVAILABLE_LETTERS);

            const result = service.checkLettersAvailability(LIMIT);

            expect(result).toEqual(expectedResult);
        });

        it('should return false if there is not enough letters in the reserve of reserveServiceSpy', () => {
            const expectedResult = false;

            const LIMIT = 10;
            const FALSE_NUMBER_OF_AVAILABLE_LETTERS = 10;
            reserveServiceSpy.getQuantityOfAvailableLetters.and.returnValue(FALSE_NUMBER_OF_AVAILABLE_LETTERS);

            const result = service.checkLettersAvailability(LIMIT);

            expect(result).toEqual(expectedResult);
        });
    });

    describe('replaceWord', () => {
        it('should call replaceLetter', () => {
            const wordToReplace = 'abc';
            // Car replaceLetter est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const replaceLetterSpy = spyOn<any>(service, 'replaceLetter').and.callFake(() => {
                return void '';
            });

            service.replaceWord(wordToReplace);

            expect(replaceLetterSpy).toHaveBeenCalledTimes(wordToReplace.length);
        });

        it('should also replace *', () => {
            const wordToReplace = '*';
            service.rackLetters = [
                { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                { name: '*', quantity: 0, points: 0, affiche: '*' },
                { name: '*', quantity: 0, points: 0, affiche: '*' },
                { name: 'D', quantity: 3, points: 2, affiche: 'D' },
                { name: 'E', quantity: 15, points: 1, affiche: 'E' },
            ];

            // Car replaceLetter est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'replaceLetter').and.callFake(() => {
                service.rackLetters[1] = { name: 'D', quantity: 3, points: 2, affiche: 'D' };
            });

            service.replaceWord(wordToReplace);

            expect(service.rackLetters[1].name).not.toEqual(wordToReplace);
        });
    });

    describe('replaceLetter', () => {
        it('should call reserveServiceSpy.getLettersFromReserve if the letter to replace is on the rack', () => {
            const LETTER_TO_REPLACE = 'A';
            const REPLACEMENT_LETTER = { name: 'X', quantity: 1, points: 10, affiche: 'X' };
            reserveServiceSpy.getLettersFromReserve.and.returnValue([REPLACEMENT_LETTER]);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](LETTER_TO_REPLACE, true);

            expect(reserveServiceSpy.getLettersFromReserve).toHaveBeenCalledWith(LETTER_TO_REPLACE.length);
        });

        it('should call fillRackPortion there is a letter for replacement', () => {
            const LETTER_TO_REPLACE = 'A';
            const INDEX_OF_LETTER_TO_REPLACE_ON_RACK = 0;
            const REPLACEMENT_LETTER = { name: 'D', quantity: 3, points: 2, affiche: 'D' };
            // Car fillRackPortion est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fillRackPortionSpy = spyOn<any>(service, 'fillRackPortion').and.callThrough();
            reserveServiceSpy.getLettersFromReserve.and.returnValue([REPLACEMENT_LETTER]);

            // Car replaceLetter est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](LETTER_TO_REPLACE, true);

            expect(fillRackPortionSpy).toHaveBeenCalledWith(INDEX_OF_LETTER_TO_REPLACE_ON_RACK);
        });

        it('should call reserveServiceSpy.addLetterInReserve if there is letter for replacement and the replacement is also in reserve', () => {
            const LETTER_TO_REPLACE = 'A';
            const REPLACEMENT_LETTER = { name: 'V', quantity: 2, points: 4, affiche: 'V' };
            reserveServiceSpy.getLettersFromReserve.and.returnValue([REPLACEMENT_LETTER]);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](LETTER_TO_REPLACE, false);

            expect(reserveServiceSpy.addLetterInReserve).toHaveBeenCalledWith(LETTER_TO_REPLACE);
        });

        it('should not call reserveServiceSpy.addLetterInReserve if there is letter for replacement but the replacement is only on rack', () => {
            const LETTER_TO_REPLACE = 'A';
            const REPLACEMENT_LETTER = { name: 'V', quantity: 2, points: 4, affiche: 'V' };
            reserveServiceSpy.getLettersFromReserve.and.returnValue([REPLACEMENT_LETTER]);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](LETTER_TO_REPLACE, true);

            expect(reserveServiceSpy.addLetterInReserve).not.toHaveBeenCalledWith(LETTER_TO_REPLACE);
        });

        it('should actually replace the letter to replace on the rack', () => {
            const LETTER_TO_REPLACE = 'A';
            const REPLACEMENT_LETTER = { name: 'V', quantity: 2, points: 4, affiche: 'V' };
            const INDEX_OF_LETTER_TO_REPLACE_ON_RACK = 0;
            reserveServiceSpy.getLettersFromReserve.and.returnValue([REPLACEMENT_LETTER]);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](LETTER_TO_REPLACE, true);

            expect(service.rackLetters[INDEX_OF_LETTER_TO_REPLACE_ON_RACK]).toEqual(REPLACEMENT_LETTER);
        });

        it('should call findLetterPosition if the rackLetters is not null', () => {
            const LETTER_TO_REPLACE = 'A';
            const REPLACEMENT_LETTER = { name: 'X', quantity: 1, points: 10, affiche: 'X' };
            reserveServiceSpy.getLettersFromReserve.and.returnValue([REPLACEMENT_LETTER]);

            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const findLetterPositionSpy = spyOn<any>(service, 'findLetterPosition').and.callThrough();

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](LETTER_TO_REPLACE, true);

            expect(findLetterPositionSpy).toHaveBeenCalled();
        });

        it('should not call fillRackPortion if the letter to replace is not on the rack', () => {
            const NOT_FOUND = -1;
            const LETTER_TO_REPLACE = 'Z';
            const REPLACEMENT_LETTER = { name: 'X', quantity: 1, points: 10, affiche: 'X' };
            // Car fillRackPortion est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fillRackPortionSpy = spyOn<any>(service, 'fillRackPortion').and.callThrough();
            reserveServiceSpy.getLettersFromReserve.and.returnValue([REPLACEMENT_LETTER]);
            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findLetterPosition').and.returnValue(NOT_FOUND);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](LETTER_TO_REPLACE, true);

            expect(fillRackPortionSpy).not.toHaveBeenCalled();
        });

        it('should not call reserveServiceSpy.addLetterInReserve if there is not letter for replacement', () => {
            const LETTER_TO_REPLACE = 'A';
            reserveServiceSpy.getLettersFromReserve.and.returnValue([]);

            // Car replaceLetterOnRackOnly est privée
            // eslint-disable-next-line dot-notation
            service['replaceLetter'](LETTER_TO_REPLACE, false);

            expect(reserveServiceSpy.addLetterInReserve).not.toHaveBeenCalled();
        });
    });

    describe('fillRackPortion', () => {
        it('should call fillText to represent letters and their number of point on the rack', () => {
            const INDEX = 1;
            const fillTextSpy = spyOn(service.rackContext, 'fillText').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](INDEX);
            expect(fillTextSpy).toHaveBeenCalledTimes(2);
        });

        it('should not call fillText if there is no letter to represent on the rack at the index provided', () => {
            const INDEX = 10;
            const fillTextSpy = spyOn(service.rackContext, 'fillText').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](INDEX);
            expect(fillTextSpy).not.toHaveBeenCalled();
        });

        it('should call clearRect once', () => {
            const INDEX = 1;
            const clearRectSpy = spyOn(service.rackContext, 'clearRect').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](INDEX);
            expect(clearRectSpy).toHaveBeenCalledTimes(1);
        });

        it('should call rect once', () => {
            const INDEX = 1;
            const rectSpy = spyOn(service.rackContext, 'rect').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](INDEX);
            expect(rectSpy).toHaveBeenCalledTimes(1);
        });

        it('should call stroke once', () => {
            const INDEX = 1;
            const strokeSpy = spyOn(service.rackContext, 'stroke').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](INDEX);
            expect(strokeSpy).toHaveBeenCalledTimes(1);
        });

        it('should call fillRect once', () => {
            const INDEX = 1;
            const fillRectSpy = spyOn(service.rackContext, 'fillRect').and.callThrough();

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](INDEX);
            expect(fillRectSpy).toHaveBeenCalledTimes(1);
        });

        it(' should color pixels on the rack canvas in a specified portion', () => {
            const RACK_SIZE = 7;

            const DEFAULT_WIDTH = 245;
            const DEFAULT_HEIGHT = 35;
            const INDEX = 1;
            let imageData = service.rackContext.getImageData((DEFAULT_WIDTH / RACK_SIZE) * INDEX, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT).data;
            const beforeSize = imageData.filter((x) => x !== 0).length;

            // Car fillRackPortion est privée
            // eslint-disable-next-line dot-notation
            service['fillRackPortion'](INDEX);

            imageData = service.rackContext.getImageData(0, 0, DEFAULT_WIDTH / RACK_SIZE, DEFAULT_HEIGHT).data;
            const afterSize = imageData.filter((x) => x !== 0).length;
            expect(afterSize).toBeGreaterThan(beforeSize);
        });
    });

    it(' fillRack should call fillRackPortion as many times as RACK_SIZE', () => {
        const RACK_SIZE = 7;
        const A_LETTER_IN_RESERVE = { name: 'X', quantity: 1, points: 10, affiche: 'X' };

        // Car fillRackPortion est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fillRackPortionSpy = spyOn<any>(service, 'fillRackPortion').and.callThrough();
        reserveServiceSpy.getLettersFromReserve.and.returnValue([A_LETTER_IN_RESERVE]);

        // Car fillRackPortion est privée
        // eslint-disable-next-line dot-notation
        service['fillRack']();

        expect(fillRackPortionSpy).toHaveBeenCalledTimes(RACK_SIZE);
    });

    it(' fillRack should call reserveServiceSpy.getLettersFromReserve once', () => {
        const A_LETTER_IN_RESERVE = { name: 'X', quantity: 1, points: 10, affiche: 'X' };
        reserveServiceSpy.getLettersFromReserve.and.returnValue([A_LETTER_IN_RESERVE]);

        // Car fillRackPortion est privée
        // eslint-disable-next-line dot-notation
        service['fillRack']();

        expect(reserveServiceSpy.getLettersFromReserve).toHaveBeenCalledTimes(1);
    });
});
