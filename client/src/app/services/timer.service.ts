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
            min: 2,
            seconds: 0,
            resetValue: 90,
            totalTimer: 10,
        };
        this.getTimerSettings();
        this.counter.resetValue = 90;
        this.startTimer();
    }

    startTimer() {
        setInterval(() => {
            this.decrementTime();
        }, 1000);
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

        this.counter.seconds = (this.counter.resetValue - secondsPassed - 1) % MAX_SECONDS;
        this.counter.min = Math.floor(totalMinutes - minutesPassed);

    
    }
}
