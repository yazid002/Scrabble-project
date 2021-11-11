import { TestBed } from '@angular/core/testing';
import { IChat } from '@app/classes/chat';

import { AideExecutionService } from './aide-execution.service';

describe('AideExecutionService', () => {
    let service: AideExecutionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AideExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('execute', () => {
        it(' should return an IChat interface', () => {
            const result: IChat = service.execute();

            expect(result.body).toBeDefined();
        });
    });
});
