import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { GameService } from '@app/services/game.service';
import { TimerService } from '@app/services/timer.service';

@Injectable({
    providedIn: 'root',
})
export class PassExecutionService {
    constructor(private timerService: TimerService, private gameService: GameService) {}
    execute(): IChat {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Vous avez passé votre tour !',
        };

        this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter = 0;
        const skipped = true;
        this.timerService.resetTimer(skipped);

        return result;
    }
}
