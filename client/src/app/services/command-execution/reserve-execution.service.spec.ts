import { TestBed } from '@angular/core/testing';
import { SENDER } from '@app/classes/chat';
import { ReserveExecutionService } from '@app/services/command-execution/reserve-execution.service';
import { ReserveService } from '@app/services/reserve.service';

describe('ReserveExecutionService', () => {
    let service: ReserveExecutionService;
    let reserveServiceSpy: jasmine.SpyObj<ReserveService>;

    beforeEach(() => {
        reserveServiceSpy = jasmine.createSpyObj('ReserveService', ['getQuantityOfAvailableLetters', 'getLettersFromReserve', 'addLetterInReserve']);
        reserveServiceSpy.alphabets = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 2, points: 3, display: 'B' },
            { name: 'C', quantity: 2, points: 3, display: 'C' },
        ];

        TestBed.configureTestingModule({
            providers: [{ provide: ReserveService, useValue: reserveServiceSpy }],
        });
        service = TestBed.inject(ReserveExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('execute', () => {
        it('should return an IChat instance with one line per letter in the body', () => {
            const result = service.execute();
            const numletters = result.body.split('<br>').length - 1;
            const numLettersExpected = 3;
            expect(result.from).toEqual(SENDER.computer);
            expect(numletters).toEqual(numLettersExpected);
        });
    });
});
