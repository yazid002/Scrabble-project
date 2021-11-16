import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { TimerService } from '@app/services/timer.service';
import { GameService } from '../game.service';

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

        console.log('ici ');
        this.gameService.players[this.gameService.currentTurn].turnWithoutSkipAndExchangeCounter = 0;
        const skipped = true;
        this.timerService.resetTimer(skipped);

        return result;
    }
}
