import { TestBed } from '@angular/core/testing';
import { ICharacter } from '@app/classes/letter.model';
import { ReserveService } from './reserve.service';

describe('ReserveService', () => {
    let service: ReserveService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ReserveService);
        service.alphabets = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 2, points: 3, affiche: 'B' },
            { name: 'C', quantity: 2, points: 3, affiche: 'C' },
            { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            { name: 'E', quantity: 15, points: 1, affiche: 'E' },
            { name: 'F', quantity: 2, points: 4, affiche: 'F' },
            { name: 'G', quantity: 2, points: 4, affiche: 'G' },
            { name: 'H', quantity: 2, points: 4, affiche: 'H' },
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('findLetterPosition', () => {
        it('should return NOT_FOUND', () => {
            const NOT_FOUND = -1;
            const LETTER_TO_CHECK = 'Z';

            // Car findLetterPosition est privée
            // eslint-disable-next-line dot-notation
            const result = service['findLetterPosition'](LETTER_TO_CHECK, service.alphabets);

            expect(result).toEqual(NOT_FOUND);
        });

        it('should return the letter position', () => {
            const POSITION = 0;
            const LETTER_TO_CHECK = 'A';

            // Car findLetterPosition est privée
            // eslint-disable-next-line dot-notation
            const result = service['findLetterPosition'](LETTER_TO_CHECK, service.alphabets);

            expect(result).toEqual(POSITION);
        });
    });

    describe('findLetterInReserve', () => {
        it(' should call findLetterPosition', () => {
            const LETTER_TO_CHECK = 'B';

            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const findLetterPositionSpy = spyOn<any>(service, 'findLetterPosition').and.callThrough();

            service.findLetterInReserve(LETTER_TO_CHECK);

            expect(findLetterPositionSpy).toHaveBeenCalled();
        });

        it('should return void if the letter to found is not in the reserve', () => {
            const NOT_FOUND = -1;
            const LETTER_TO_CHECK = 'Z';

            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findLetterPosition').and.returnValue(NOT_FOUND);

            const result = service.findLetterInReserve(LETTER_TO_CHECK);

            expect(result).toEqual(void '');
        });

        it('should return the letter found', () => {
            const POSITION = 0;
            const LETTER_TO_CHECK = 'A';
            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findLetterPosition').and.returnValue(POSITION);

            const result = service.findLetterInReserve(LETTER_TO_CHECK);

            expect(result).toEqual(service.alphabets[POSITION]);
        });
    });

    describe('addLetterInReserve', () => {
        it('should not add the specified letter if it is not in the reserve', () => {
            const NOT_FOUND = -1;
            const LETTER_TO_ADD = 'Z';
            const INITIAL_RESERVE = [
                { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                { name: 'B', quantity: 2, points: 3, affiche: 'B' },
                { name: 'C', quantity: 2, points: 3, affiche: 'C' },
                { name: 'D', quantity: 3, points: 2, affiche: 'D' },
                { name: 'E', quantity: 15, points: 1, affiche: 'E' },
                { name: 'F', quantity: 2, points: 4, affiche: 'F' },
                { name: 'G', quantity: 2, points: 4, affiche: 'G' },
                { name: 'H', quantity: 2, points: 4, affiche: 'H' },
            ];
            service.alphabets = INITIAL_RESERVE;

            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findLetterPosition').and.returnValue(NOT_FOUND);

            service.addLetterInReserve(LETTER_TO_ADD);

            expect(service.alphabets).toEqual(INITIAL_RESERVE);
        });

        it(' should add the specified letter if it is in the reserve', () => {
            const POSITION = 0;
            const LETTER_TO_ADD = 'A';

            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findLetterPosition').and.returnValue(POSITION);

            const expectedResult = service.alphabets[POSITION].quantity + 1;
            service.addLetterInReserve(LETTER_TO_ADD);

            expect(service.alphabets[POSITION].quantity).toEqual(expectedResult);
        });
    });

    describe('getQuantityOfAvailableLetters', () => {
        it('should return the quantity of available letters in the reserve', () => {
            service.alphabets = [
                { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                { name: 'B', quantity: 2, points: 3, affiche: 'B' },
                { name: 'C', quantity: 2, points: 3, affiche: 'C' },
                { name: 'D', quantity: 3, points: 2, affiche: 'D' },
            ];

            const expectedResult = 16;
            const result = service.getQuantityOfAvailableLetters();

            expect(result).toEqual(expectedResult);
        });

        it('should return 0 if there is no letter in the reserve', () => {
            service.alphabets = [];

            const expectedResult = 0;
            const result = service.getQuantityOfAvailableLetters();

            expect(result).toEqual(expectedResult);
        });
    });

    describe('getLettersFromReserve', () => {
        it('should call getQuantityOfAvailableLetters', () => {
            const REQUESTED_QUANTITY = 5;

            const getQuantityOfAvailableLettersSpy = spyOn(service, 'getQuantityOfAvailableLetters').and.callThrough();

            service.getLettersFromReserve(REQUESTED_QUANTITY);

            expect(getQuantityOfAvailableLettersSpy).toHaveBeenCalledTimes(1);
        });

        it('should return an empty array if there is no letter available in the reserve', () => {
            const REQUESTED_QUANTITY = 5;
            const AVAILABLE_QUANTITY = 0;

            spyOn(service, 'getQuantityOfAvailableLetters').and.returnValue(AVAILABLE_QUANTITY);

            const expectedResult: ICharacter[] = [];
            const result = service.getLettersFromReserve(REQUESTED_QUANTITY);

            expect(result).toEqual(expectedResult);
        });

        it('should return an empty array if the quantity of available letters is less than the requested quantity', () => {
            const REQUESTED_QUANTITY = 5;
            const AVAILABLE_QUANTITY = 4;

            spyOn(service, 'getQuantityOfAvailableLetters').and.returnValue(AVAILABLE_QUANTITY);

            const expectedResult: ICharacter[] = [];
            const result = service.getLettersFromReserve(REQUESTED_QUANTITY);

            expect(result).toEqual(expectedResult);
        });

        it(
            'should return an array with the number of requested letters if the quantity' +
                ' of available letters is equal to the requested quantity',
            () => {
                const REQUESTED_QUANTITY = 5;
                const AVAILABLE_QUANTITY = 5;

                spyOn(service, 'getQuantityOfAvailableLetters').and.returnValue(AVAILABLE_QUANTITY);

                const result = service.getLettersFromReserve(REQUESTED_QUANTITY);

                expect(result.length).toEqual(REQUESTED_QUANTITY);
            },
        );

        it('should return an array with the number of requested letters', () => {
            const REQUESTED_QUANTITY = 5;
            const AVAILABLE_QUANTITY = 7;

            spyOn(service, 'getQuantityOfAvailableLetters').and.returnValue(AVAILABLE_QUANTITY);

            const result = service.getLettersFromReserve(REQUESTED_QUANTITY);

            expect(result.length).toEqual(REQUESTED_QUANTITY);
        });

        it('should call findLetterPosition as many as the requested quantity', () => {
            const REQUESTED_QUANTITY = 5;
            const AVAILABLE_QUANTITY = 7;

            spyOn(service, 'getQuantityOfAvailableLetters').and.returnValue(AVAILABLE_QUANTITY);

            // Car findLetterPosition est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const findLetterPositionSpy = spyOn<any>(service, 'findLetterPosition').and.callThrough();

            service.getLettersFromReserve(REQUESTED_QUANTITY);

            expect(findLetterPositionSpy).toHaveBeenCalledTimes(REQUESTED_QUANTITY);
        });
    });
});
