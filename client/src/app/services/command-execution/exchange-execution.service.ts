import { Injectable } from '@angular/core';
import { IChat, IComputerResponse, SENDER } from '@app/classes/chat';
import { CommandError } from '@app/classes/command-errors/command-error';
import { ExchangeService } from '@app/services/exchange.service';

// const COMMAND_INDEX = 0;
const ARGUMENTS_INDEX = 1;
@Injectable({
    providedIn: 'root',
})
export class ExchangeExecutionService {
    constructor(private exchangeService: ExchangeService) {}
    execute(parameters: string[]): IComputerResponse {
        const lettersToChange: string[] = parameters[ARGUMENTS_INDEX].split('');
        const result: IChat = {
            from: SENDER.computer,
            body: 'Went through the exchange execution service',
        };
        const response: IComputerResponse = {
            success: true,
            response: result,
        };
        try {
            this.exchangeService.exchangeLetters(lettersToChange);
            // « NomDuJoueurQuiÉchange : !échanger lettres »
            // result.body = `"NomDuJoueurQuiÉchange" : !echanger ${lettersToChange.join('')}`;
        } catch (error) {
            if (error instanceof CommandError) {
                result.body = error.message;
                // response.success = false;
                return response;
            } else {
                throw error;
            }
        }
        return response;
    }
}
