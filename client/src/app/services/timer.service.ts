import { Injectable } from '@angular/core';
import { UserSettingsService } from './user-settings.service';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    counter: {
        min: number;
        seconds: number;
        resetValue: number;
        totalTimer: number;
    };

    constructor(private userSettingsService: UserSettingsService) {
        this.counter = {
            min: 0,
            seconds: 0,
            resetValue: 0,
            totalTimer: 0,
        };
        this.startTimer();
    }
    startTimer() {
        this.getTimerSettings();
        const timerIntervalMS = 1000;
        setInterval(() => {
            this.decrementTime();
        }, timerIntervalMS);
    }
    private getTimerSettings() {
        const timer = Number(this.userSettingsService.settings.timer.currentChoiceKey);

        this.counter.resetValue = timer;
    }
    private decrementTime() {
        const MAX_SECONDS = 60;
        this.counter.totalTimer = (this.counter.totalTimer + 1) % this.counter.resetValue;
        const totalMinutes = this.counter.resetValue / MAX_SECONDS;
        const minutesPassed = this.counter.totalTimer / MAX_SECONDS;
        const secondsPassed = this.counter.totalTimer;

        this.counter.seconds = (this.counter.resetValue - secondsPassed) % MAX_SECONDS;
        this.counter.min = Math.max(0, Math.floor(totalMinutes - minutesPassed));
    }
}
