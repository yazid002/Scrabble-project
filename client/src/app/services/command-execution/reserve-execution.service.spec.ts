import { TestBed } from '@angular/core/testing';
import { ReserveExecutionService } from '@app/services/command-execution/reserve-execution.service';
import { ReserveService } from '@app/services/reserve.service';

describe('ReserveExecutionService', () => {
    let service: ReserveExecutionService;
    let reserveServiceSpy: jasmine.SpyObj<ReserveService>;

    beforeEach(() => {
        reserveServiceSpy = jasmine.createSpyObj('ReserveService', ['getQuantityOfAvailableLetters', 'getLettersFromReserve', 'addLetterInReserve']);
        reserveServiceSpy.alphabets = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 2, points: 3, affiche: 'B' },
            { name: 'C', quantity: 2, points: 3, affiche: 'C' },
        ];
        TestBed.configureTestingModule({ providers: [{ provide: ReserveService, useValue: reserveServiceSpy }] });
        service = TestBed.inject(ReserveExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('execute', () => {
        it(' should return the quantity of letters for each letter in the reserve', () => {
            const result = service.execute();

            const expectedResult = 'Went through the reserve execution service \n<br>A: 9\n<br>B: 2\n<br>C: 2';

            expect(result.body).toEqual(expectedResult);
        });
    });
});
