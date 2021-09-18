import { Injectable } from '@angular/core';
import { DebugExecutionService } from './debug-execution.service';
import { ExchangeExecutionService } from './exchange-execution.service';
import { PassExecutionService } from './pass-execution.service';
import { PlaceExecutionService } from './place-execution.service';
import { ReserveExecutionService } from './reserve-execution.service';
import { IChat, IComputerResponse, SENDER } from '@app/classes/chat';

@Injectable({
    providedIn: 'root',
})
export class CommandExecutionService {
    constructor(
        private reserveExecutionService: ReserveExecutionService,
        private placeExecutionService: PlaceExecutionService,
        private debugExecutionService: DebugExecutionService,
        private passExecutionService: PassExecutionService,
        private exchangeExecutionService: ExchangeExecutionService,
    ) {}
    interpretCommand(command: string): IComputerResponse {
        /**
         * Interprets the command given in parameter and returns whether or not a command was executed.
         * If No command was executed, the command was invalid
         */

        /*
         format command string and 
         remove accents from letters https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        */
        command = command
            .replace('!', '')
            .replace('\n', '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const parameters: string[] = command.split(' ');
        switch (parameters[0]) {
            case 'placer':
                return this.placeExecutionService.execute(parameters);
            case 'echanger':
                return this.exchangeExecutionService.execute();
            case 'passer':
                return this.passExecutionService.execute();
            case 'debug':
                return this.debugExecutionService.execute();
            case 'reserve':
                return this.reserveExecutionService.execute();
            default:
                break;
        }
        const result: IChat = {
            from: SENDER.computer,
            body: 'Invalid Command',
        };
        const response: IComputerResponse = {
            success: false,
            response: result,
        };
        return response;
    }
}
