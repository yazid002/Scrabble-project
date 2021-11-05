import { TestBed } from '@angular/core/testing';
import { CommandError } from '@app/classes/command-errors/command-error';
import { ExchangeExecutionService } from '@app/services/command-execution/exchange-execution.service';
import { ExchangeService } from '@app/services/exchange.service';

describe('ExchangeExecutionService', () => {
    let service: ExchangeExecutionService;
    let exchangeServiceSpy: jasmine.SpyObj<ExchangeService>;

    beforeEach(() => {
        exchangeServiceSpy = jasmine.createSpyObj('ExchangeService', ['exchangeLetters']);
        TestBed.configureTestingModule({ providers: [{ provide: ExchangeService, useValue: exchangeServiceSpy }] });
        service = TestBed.inject(ExchangeExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('execute', () => {
        it(' should call exchangeLetters of exchangeServiceSpy', () => {
            const PARAMETERS = ['echanger', 'dos'];

            service.execute(PARAMETERS, true);

            expect(exchangeServiceSpy.exchangeLetters).toHaveBeenCalledTimes(1);
        });

        it(' should catch and return an error throw by exchangeServiceSpy', () => {
            const PARAMETERS = ['echanger', 'dos'];

            exchangeServiceSpy.exchangeLetters.and.throwError(new CommandError('Une erreur de test.'));

            const result = service.execute(PARAMETERS, true);

            expect(result.body).toEqual('Erreur de commande : Une erreur de test.');
        });

        it(' should propagate the error if it is not a commandError', () => {
            const PARAMETERS = ['echanger', 'dos'];

            exchangeServiceSpy.exchangeLetters.and.throwError(new Error('Une erreur de test.'));

            expect(() => service.execute(PARAMETERS, true)).toThrow(new Error('Une erreur de test.'));
        });

        it(' should return the initial result if no error was threw', () => {
            const PARAMETERS = ['echanger', 'dos'];

            exchangeServiceSpy.exchangeLetters.and.returnValue(void '');

            const result = service.execute(PARAMETERS, true);

            expect(result.body).toEqual('Échange de lettres réussi !');
        });
    });
});
