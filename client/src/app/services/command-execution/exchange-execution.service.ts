import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { CommandError } from '@app/classes/command-errors/command-error';
import { ExchangeService } from '@app/services/exchange.service';

const ARGUMENTS_INDEX = 1;
@Injectable({
    providedIn: 'root',
})
export class ExchangeExecutionService {
    constructor(private exchangeService: ExchangeService) {}
    execute(parameters: string[]): IChat {
        const lettersToChange: string[] = parameters[ARGUMENTS_INDEX].split('');
        const result: IChat = {
            from: SENDER.computer,
            body: 'Échangé les lettres avec succès',
        };

        try {
            this.exchangeService.exchangeLetters(lettersToChange);
        } catch (error) {
            if (error instanceof CommandError) {
                result.body = error.message;
                return result;
            } else {
                throw error;
            }
        }
        return result;
    }
}
