import { TestBed } from '@angular/core/testing';
import { TimerService } from './timer.service';

fdescribe('TimerService', () => {
    let service: TimerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should emit an event when timer hits zero', () => {
        let skipped = false;
        service.timerDone.next(skipped);
        service.counter.totalTimer = service.counter.resetValue - 1;
        service.timerDone.subscribe((val) => {
            skipped = val;
        });
        // eslint-disable-next-line dot-notation
        service['decrementTime']();
        expect(skipped).toBe(true);
    });
});
