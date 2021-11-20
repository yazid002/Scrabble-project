import { TestBed } from '@angular/core/testing';
import { GoalsManagerService } from './goals-manager.service';

describe('GoalsManagerService', () => {
    let service: GoalsManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GoalsManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
