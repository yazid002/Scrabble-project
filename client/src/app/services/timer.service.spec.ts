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
        let value = false;
        service.timerDone.next(value);
        service.counter.totalTimer = service.counter.resetValue - 1;
        service.timerDone.subscribe((val) => {
            value = val;
        });
        // eslint-disable-next-line dot-notation
        service['decrementTime']();
        expect(value).toBe(true);
    });
});
