import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { SelectionManagerService } from '@app/services/selection-manager.service';
import { TimerService } from '@app/services/timer.service';

@Injectable({
    providedIn: 'root',
})
export class PassExecutionService {
    constructor(private timerService: TimerService, private selectionManagerService: SelectionManagerService) {}

    execute(): IChat {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Vous avez passé votre tour !',
        };

        this.selectionManagerService.cancelPlacementDirectly();

        this.timerService.resetTurnCounter.next(true);
        const skipped = true;
        this.timerService.resetTimer(skipped);

        return result;
    }
}
