import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SelectionManagerService } from '@app/services/selection-manager.service';
import { PassExecutionService } from './pass-execution.service';

describe('PassExecutionService', () => {
    let service: PassExecutionService;
    let selectionManagerServiceSpy: jasmine.SpyObj<SelectionManagerService>;

    beforeEach(() => {
        selectionManagerServiceSpy = jasmine.createSpyObj('SelectionManagerService', ['cancelPlacementDirectly']);

        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [{ provide: SelectionManagerService, useValue: selectionManagerServiceSpy }],
        });
        service = TestBed.inject(PassExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('execute', () => {
        it(' should return the initial result if no error was threw', () => {
            const result = service.execute();

            expect(result.body).toEqual('Vous avez passé votre tour !');
        });

        it(' should cancel the current placement', () => {
            selectionManagerServiceSpy.cancelPlacementDirectly.and.returnValue(void '');
            service.execute();

            expect(selectionManagerServiceSpy.cancelPlacementDirectly).toHaveBeenCalled();
        });
    });
});
