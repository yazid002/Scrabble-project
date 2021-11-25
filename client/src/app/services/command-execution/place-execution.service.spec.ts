import { TestBed } from '@angular/core/testing';
import { SENDER } from '@app/classes/chat';
import { Vec2 } from '@app/classes/vec2';
import { PlaceExecutionService } from '@app/services/command-execution/place-execution.service';
import { PlaceService } from '@app/services/place.service';

describe('PlaceExecuteService', () => {
    let service: PlaceExecutionService;
    let placeServiceSpy: jasmine.SpyObj<PlaceService>;

    beforeEach(() => {
        placeServiceSpy = jasmine.createSpyObj('PlaceService', ['placeWord']);
        TestBed.configureTestingModule({ providers: [{ provide: PlaceService, useValue: placeServiceSpy }] });
        service = TestBed.inject(PlaceExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('extractParameters', () => {
        it(' should return the right parameters', () => {
            const POSITION = 'g15v';
            // extractParameters is private
            // eslint-disable-next-line dot-notation
            const result = service['extractParameters'](POSITION);

            const expectedResult = { direction: 'v', coord: { y: 6, x: 14 } } as {
                direction: string;
                coord: Vec2;
            };

            expect(result).toEqual(expectedResult);
        });
    });

    describe('execute', () => {
        it(' should call extractParameters', () => {
            const PARAMETERS = ['placer', 'g15v', 'dos'];
            // extractParameters is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const extractParametersSpy = spyOn<any>(service, 'extractParameters').and.callThrough();
            placeServiceSpy.placeWord.and.returnValue(Promise.resolve({ error: false, message: { from: SENDER.computer, body: '' } }));

            service.execute(PARAMETERS, true);

            expect(extractParametersSpy).toHaveBeenCalled();
        });

        it(' should call placeServiceSpy.placeWord', () => {
            const PARAMETERS = ['placer', 'g15v', 'dos'];

            placeServiceSpy.placeWord.and.returnValue(Promise.resolve({ error: false, message: { from: SENDER.computer, body: '' } }));

            service.execute(PARAMETERS, true);

            expect(placeServiceSpy.placeWord).toHaveBeenCalled();
        });

        it(' should return the initial result if no error was thrown', async () => {
            const PARAMETERS = ['placer', 'g15v', 'dos'];

            placeServiceSpy.placeWord.and.returnValue(Promise.resolve({ error: false, message: { from: SENDER.computer, body: '' } }));

            await service.execute(PARAMETERS, true).then((result) => {
                expect(result.body).toEqual('Le mot a été placé avec succès !');
            });
        });

        it(' should catch and return an error thrown by placeServiceSpy', async () => {
            const PARAMETERS = ['placer', 'g15v', 'd'];

            placeServiceSpy.placeWord.and.returnValue(
                Promise.reject({ error: true, message: { from: SENDER.computer, body: 'Erreur de commande : Une erreur de test.' } }),
            );

            const result = await service.execute(PARAMETERS, true).then((error) => {
                return error;
            });

            expect(result.body).toEqual('Erreur de commande : Une erreur de test.');
        });

        it(' should propagate the error if it is not a commandError', async () => {
            const PARAMETERS = ['placer', 'g15v', 'd'];

            placeServiceSpy.placeWord.and.throwError(new Error('Une erreur de test.'));

            try {
                await service.execute(PARAMETERS, true);
            } catch (error) {
                expect(error).toEqual(new Error('Une erreur de test.'));
            }
        });
    });
});
