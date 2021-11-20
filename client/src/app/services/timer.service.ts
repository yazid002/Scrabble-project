import { Injectable, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserSettingsService } from './user-settings.service';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    @Output() timerDone = new BehaviorSubject<boolean>(true); // value of boolean represents whether or not the player skips his turn
    // value of boolean represents whether or not the player has finished its time without placing
    @Output() resetTurnCounter = new BehaviorSubject<boolean>(true);

    isEnabled: boolean;
    nextResetValue: number;
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
        this.isEnabled = true;
    }
    resetTimerDelay(delay: number) {
        this.nextResetValue = this.counter.totalTimer + delay;
    }
    startTimer() {
        this.getTimerSettings();
        const timerIntervalMS = 1000;
        setInterval(() => {
            if (this.isEnabled) {
                this.decrementTime();
            }
        }, timerIntervalMS);
    }
    resetTimer(skipped: boolean = false) {
        this.nextResetValue = this.counter.resetValue;
        this.counter.totalTimer = 0; // = this.counter.resetValue;
        this.calculateMinNSecond();
        // put a slight delay so if the virtual player plays quuicly, we won't emit two signals at once
        this.timerDone.next(skipped);
    }
    private getTimerSettings() {
        const timer = Number(this.userSettingsService.settings.timer.currentChoiceKey);

        this.counter.resetValue = timer;
    }
    private decrementTime() {
        this.counter.totalTimer = (this.counter.totalTimer + 1) % this.counter.resetValue;
        this.calculateMinNSecond();
        if (this.counter.totalTimer === 0 || this.counter.totalTimer >= this.nextResetValue) {
            this.resetTurnCounter.next(true);
            this.resetTimer(true);
        }
    }
    private calculateMinNSecond() {
        const MAX_SECONDS = 60;
        const totalMinutes = this.counter.resetValue / MAX_SECONDS;
        const minutesPassed = this.counter.totalTimer / MAX_SECONDS;
        const secondsPassed = this.counter.totalTimer;

        this.counter.seconds = (this.counter.resetValue - secondsPassed) % MAX_SECONDS;
        this.counter.min = Math.max(0, Math.floor(totalMinutes - minutesPassed));
    }
}
