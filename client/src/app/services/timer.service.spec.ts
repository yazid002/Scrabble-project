import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TimerService } from './timer.service';
import { UserSettingsService } from './user-settings.service';

describe('TimerService', () => {
    let service: TimerService;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;

    beforeEach(() => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries']);
        userSettingsServiceSpy.getDictionaries.and.callFake(() => undefined);

        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
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
    it('should not decrement timer if timer is not enabled', (done) => {
        service.isEnabled = false;
        const timeInit = 0;
        service.counter = {
            min: 0,
            seconds: 0,
            resetValue: 60,
            totalTimer: timeInit,
        };
        const numSeconds = 3;
        const miliInSeconds = 1000;
        service.startTimer();
        setTimeout(() => {
            expect(service.counter.totalTimer).toEqual(timeInit);
            done();
        }, numSeconds * miliInSeconds);
    });
});
