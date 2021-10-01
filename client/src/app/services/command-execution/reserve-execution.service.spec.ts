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
        it('not display reserve if debug mode is inactive', () => {
            const result = service.execute();

            const expectedResult = 'La commande <strong>reserve</strong> est uniquement disponible lorsque le mode débuguage est activé';

            expect(result.body).toEqual(expectedResult);
        });
    });
});
