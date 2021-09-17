import { Injectable } from '@angular/core';
import { IChat, IComputerResponse, SENDER } from '@app/classes/chat';
import { ExchangeService } from '../exchange.service';

// const COMMAND_INDEX = 0;
const ARGUMENTS_INDEX = 1;
@Injectable({
    providedIn: 'root',
})
export class ExchangeExecutionService {
    constructor(private exchangeService: ExchangeService) {}
    execute(parameters: string[]): IComputerResponse {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Went through the exchange execution service',
        };
        const response: IComputerResponse = {
            success: true,
            response: result,
        };

        const lettersToChange: string[] = parameters[ARGUMENTS_INDEX].split('');
        console.log(lettersToChange);
        console.log(this.exchangeService.checkLettersRackOccurrence(lettersToChange[0]));
        const status = this.exchangeService.exchangeLetters(lettersToChange);
        console.log(status);

        return response;
    }
}
