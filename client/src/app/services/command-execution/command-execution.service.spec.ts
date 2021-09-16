import { TestBed } from '@angular/core/testing';

import { CommandExecutionService } from './command-execution.service';

describe('CommandExecutionService', () => {
    let service: CommandExecutionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommandExecutionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
