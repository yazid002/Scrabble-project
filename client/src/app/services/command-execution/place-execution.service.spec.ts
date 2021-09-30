import { TestBed } from '@angular/core/testing';
import { CommandError } from '@app/classes/command-errors/command-error';
import { Vec2 } from '@app/classes/vec2';
import { PlaceExecutionService } from '@app/services/command-execution/place-execution.service';
import { GridService } from '@app/services/grid.service';

describe('PlaceExecuteService', () => {
    let service: PlaceExecutionService;
    let gridServiceSpy: jasmine.SpyObj<GridService>;

    beforeEach(() => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['placeWord']);
        TestBed.configureTestingModule({ providers: [{ provide: GridService, useValue: gridServiceSpy }] });
        service = TestBed.inject(PlaceExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('extractParameters', () => {
        it(' should return the right parameters', () => {
            const POSITION = 'g15v';
            // Car extractParameters est privée
            // eslint-disable-next-line dot-notation
            const result = service['extractParameters'](POSITION);

            const expectedResult = { direction: 'v', coord: { x: 6, y: 14 } } as {
                direction: string;
                coord: Vec2;
            };

            expect(result).toEqual(expectedResult);
        });
    });

    describe('execute', () => {
        it(' should call extractParameters', () => {
            const PARAMETERS = ['placer', 'g15v', 'dos'];
            // Car extractParameters est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const extractParametersSpy = spyOn<any>(service, 'extractParameters').and.callThrough();
            gridServiceSpy.placeWord.and.returnValue(Promise.resolve(void ''));

            service.execute(PARAMETERS);

            expect(extractParametersSpy).toHaveBeenCalled();
        });

        it(' should call gridServiceSpy.placeWord', () => {
            const PARAMETERS = ['placer', 'g15v', 'dos'];

            gridServiceSpy.placeWord.and.returnValue(Promise.resolve(void ''));

            service.execute(PARAMETERS);

            expect(gridServiceSpy.placeWord).toHaveBeenCalled();
        });

        it(' should return the initial result if no error was thrown', async () => {
            const PARAMETERS = ['placer', 'g15v', 'dos'];

            gridServiceSpy.placeWord.and.returnValue(Promise.resolve(void ''));

            await service.execute(PARAMETERS).then((result) => {
                expect(result.body).toEqual('Placer le mot avec succès');
            });
        });

        it(' should catch and return an error thrown by gridServiceSpy', async () => {
            const PARAMETERS = ['placer', 'g15v', 'd'];

            gridServiceSpy.placeWord.and.returnValue(Promise.reject(new CommandError('Une erreur de test.')));

            const result = await service.execute(PARAMETERS).then((error) => {
                return error;
            });

            expect(result.body).toEqual('Erreur de commande : Une erreur de test.');
        });

        it(' should propagate the error if it is not a commandError', async () => {
            const PARAMETERS = ['placer', 'g15v', 'd'];

            gridServiceSpy.placeWord.and.throwError(new Error('Une erreur de test.'));

            try {
                await service.execute(PARAMETERS);
            } catch (error) {
                expect(error).toEqual(new Error('Une erreur de test.'));
            }
        });
    });
});
