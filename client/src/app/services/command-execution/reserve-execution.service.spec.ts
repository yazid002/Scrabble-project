import { TestBed } from '@angular/core/testing';
import { IChat, SENDER } from '@app/classes/chat';
import { ReserveExecutionService } from '@app/services/command-execution/reserve-execution.service';
import { ReserveService } from '@app/services/reserve.service';
import { DebugExecutionService } from './debug-execution.service';

describe('ReserveExecutionService', () => {
    let service: ReserveExecutionService;
    let reserveServiceSpy: jasmine.SpyObj<ReserveService>;
    let debugExecutionServiceSpy: jasmine.SpyObj<DebugExecutionService>;

    beforeEach(() => {
        reserveServiceSpy = jasmine.createSpyObj('ReserveService', ['getQuantityOfAvailableLetters', 'getLettersFromReserve', 'addLetterInReserve']);
        reserveServiceSpy.alphabets = [
            { name: 'A', quantity: 9, points: 1, affiche: 'A' },
            { name: 'B', quantity: 2, points: 3, affiche: 'B' },
            { name: 'C', quantity: 2, points: 3, affiche: 'C' },
        ];

        debugExecutionServiceSpy = jasmine.createSpyObj('DebugExecutionService', ['execute']);

        TestBed.configureTestingModule({
            providers: [
                { provide: ReserveService, useValue: reserveServiceSpy },
                { provide: DebugExecutionService, useValue: debugExecutionServiceSpy },
            ],
        });
        service = TestBed.inject(ReserveExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('execute', () => {
        it('not display reserve if debug mode is inactive', () => {
            const result = service.execute();

            const expectedResult = 'La commande <strong>reserve</strong> est uniquement disponible lorsque le mode débogage est activé';

            expect(result.body).toEqual(expectedResult);
        });

        it('should return the right result if debugExecutionServiceSpy.state is true', () => {
            debugExecutionServiceSpy.state = true;
            const result = service.execute();

            const expectedResult: IChat = {
                from: SENDER.computer,
                body: 'A: 9<br>B: 2<br>C: 2<br>',
            };

            // Car buildReserveMessage est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'buildReserveMessage').and.returnValue(expectedResult);

            expect(result.body).toEqual(expectedResult.body);
        });
    });
});
