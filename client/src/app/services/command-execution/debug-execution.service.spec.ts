import { TestBed } from '@angular/core/testing';
import { DebugExecutionService } from './debug-execution.service';

describe('DebugExecutionService', () => {
    let service: DebugExecutionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DebugExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('execute', () => {
        it(' should return the initial result if no error was threw', () => {
            const result = service.execute();

            expect(result.body).toEqual('Commande debug exécutée avec succès !');
        });
    });
});
