import { Injectable } from '@angular/core';
import { place } from './validation-placer';
import { exchange } from './validation-exchange';
import { pass } from './validation-pass';
import { debug } from './validation-debug';
import { reserve } from './validation-reserve';
@Injectable({
    providedIn: 'root',
})
export class CommandExecutionService {
    interpretCommand(command: string): boolean {
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
                return place(parameters);
            case 'echanger':
                return exchange(parameters);
            case 'passer':
                return pass();
            case 'debug':
                return debug();
            case 'reserve':
                return reserve();
            default:
                break;
        }
        return false;
    }
}
