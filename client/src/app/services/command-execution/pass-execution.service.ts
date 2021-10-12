import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { GameService } from '../game.service';
import { TimerService } from '../timer.service';
@Injectable({
    providedIn: 'root',
})
export class PassExecutionService {
    constructor(private gameService: GameService, private timerService: TimerService){}
    execute(): IChat {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Vous avez passé votre tour !',
        };

        this.gameService.changeTurn();
        this.timerService.resetTimer();

        return result;
    }
}
