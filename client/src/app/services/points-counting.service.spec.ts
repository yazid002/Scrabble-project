import { TestBed } from '@angular/core/testing';
import { PointsCountingService } from './points-counting.service';

describe('PointsCountingService', () => {
    let service: PointsCountingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PointsCountingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
