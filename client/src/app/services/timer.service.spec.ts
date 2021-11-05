import { TestBed } from '@angular/core/testing';
import { TimerService } from './timer.service';

describe('TimerService', () => {
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
        service.isEnabled = true;
        service.timerDone.next(skipped);
        service.counter = {
            min: 0,
            seconds: 0,
            resetValue: 60,
            totalTimer: 59,
        };
        service.counter.totalTimer = service.counter.resetValue - 1;
        service.timerDone.subscribe((val) => {
            skipped = val;
        });
        // eslint-disable-next-line dot-notation
        service['decrementTime']();
        expect(skipped).toBe(true);
    });
});
