import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { ExchangeService } from '@app/services/exchange.service';

const ARGUMENTS_INDEX = 1;
@Injectable({
    providedIn: 'root',
})
export class ExchangeExecutionService {
    constructor(private exchangeService: ExchangeService) {}
    execute(parameters: string[], viaCommand: boolean): IChat {
        const lettersToChange: string[] = parameters[ARGUMENTS_INDEX].split('');
        const result: IChat = {
            from: SENDER.computer,
            body: 'Échange de lettres réussi !',
        };

        const response = this.exchangeService.exchangeLetters(lettersToChange, viaCommand);
        if (response.error) {
            result.body = response.message.body;
        }

        return result;
    }
}
