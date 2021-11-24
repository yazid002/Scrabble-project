import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { LeaderboardService } from './leaderboard.service';
describe('LeaderboardService', () => {
    let service: LeaderboardService;
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
        service = TestBed.inject(LeaderboardService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });
    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
