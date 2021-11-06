import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { TimerService } from '@app/services/timer.service';

@Injectable({
    providedIn: 'root',
})
export class PassExecutionService {
    constructor(private timerService: TimerService) {}
    execute(): IChat {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Vous avez passé votre tour !',
        };

        const skipped = true;
        this.timerService.resetTimer(skipped);

        return result;
    }
}
