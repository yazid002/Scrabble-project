import { Injectable } from '@angular/core';
import { place } from './validation-placer';
@Injectable({
    providedIn: 'root',
})
export class CommandExecutionService {
    interpretCommand(command: string): boolean {
        /**
         * Interprets the command given in parameter and returns whether or not a command was executed. If No command was executed, the command was invalid
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
                return this.exchange(parameters);
            case 'passer':
                return this.pass();
            case 'debug':
                return this.debug();
            case 'reserve':
                return this.reserve();
            default:
                break;
        }
        return false;
    }

    private exchange(parameters: string[]): boolean {
        return true;
    }
    private pass(): boolean {
        return true;
    }
    private debug(): boolean {
        return true;
    }
    private reserve(): boolean {
        return true;
    }
}
