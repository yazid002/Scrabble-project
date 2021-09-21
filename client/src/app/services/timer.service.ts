import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TimerService {
    counter: {
        min: number;
        seconds: number;
    };

    constructor() {
        this.counter = {
            min: 2,
            seconds: 0,
        };
    }

    startTimer() {
        this.counter = { min: 2, seconds: 0 };

        const intervald = setInterval(() => {
            if (this.counter.seconds - 1 === -1) {
                this.counter.min -= 1;
                this.counter.seconds = 59;
            } else {
                this.counter.seconds -= 1;
                if (this.counter.min === 0 && this.counter.seconds === 0) clearInterval(intervald);
            }
        }, 1000);
    }
}
