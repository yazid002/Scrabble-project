import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RESPONSE_DELAY } from '@app/constants/url';
import { Leaderboard, LeaderboardService } from './leaderboard.service';

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
    describe('fetchClassic', () => {
        it('should fetch leaderboard from the server', (done) => {
            const sortSpy = spyOn(service, 'sortLeaderBoard');
            service.fetchClassic();

            const req = httpTestingController.expectOne(service.urlString + '/ClassicLeaderboard');

            expect(req.request.method).toEqual('GET');

            const players: Leaderboard[] = [
                { name: 'a name', score: 199, mode: 'classic' },
                { name: 'another name', score: 5, mode: 'classic' },
            ];
            const serverResponse = new HttpResponse({ body: players });
            req.event(serverResponse);
            setTimeout(() => {
                expect(sortSpy).toHaveBeenCalled();
                done();
            }, RESPONSE_DELAY);
        });
    });
    describe('fetchLog2990', () => {
        it('should fetch leaderboard from the server', (done) => {
            const sortSpy = spyOn(service, 'sortLeaderBoard');
            service.fetchLog2990();

            const req = httpTestingController.expectOne(service.urlString);

            expect(req.request.method).toEqual('GET');

            const players: Leaderboard[] = [
                { name: 'a name', score: 199, mode: 'classic' },
                { name: 'another name', score: 5, mode: 'classic' },
            ];
            const serverResponse = new HttpResponse({ body: players });
            req.event(serverResponse);
            setTimeout(() => {
                expect(sortSpy).toHaveBeenCalled();
                done();
            }, RESPONSE_DELAY);
        });
    });
});
