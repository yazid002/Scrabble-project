import { Injectable } from '@angular/core';
import { IChat } from '@app/classes/chat';
import { CommandSyntaxError } from '@app/classes/command-errors/command-syntax-error';
import { DebugExecutionService } from './debug-execution.service';
import { ExchangeExecutionService } from './exchange-execution.service';
import { PassExecutionService } from './pass-execution.service';
import { PlaceExecutionService } from './place-execution.service';
import { ReserveExecutionService } from './reserve-execution.service';

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
    interpretCommand(command: string) {
        this.process(command);
    }
    executeCommand(command: string): IChat {
        const functionToExecute: () => IChat = this.process(command);
        return functionToExecute();
    }
    private process(command: string): () => IChat {
        /**
         * Interprets the command given in parameter and returns a response from the right execution service
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
        const commandFormatMapping: Map<string, { format: string; description: string; command: () => IChat }> = new Map([
            [
                'placer',
                {
                    // TO DO: Fait en considérant que la ligne est en minuscule, si cela n'a pas d'importance (maj ou min),
                    // remplacer [a-z] par [A-Za-z]
                    format: '^placer[\\s][a-z]+[0-9]+(h|v)[\\s][A-Za-z]+$',
                    description: '"!placer <ligne><colonne>(h|v) <mot>" sans espace entre la ligne, la colonne et la direction',
                    command: () => {
                        return this.placeExecutionService.execute(parameters);
                    },
                },
            ],
            [
                'echanger',
                {
                    format: '^echanger[\\s][a-z]+$',
                    description: '"!echanger <arguments>" sans majuscule ni espace entre les lettres à échanger',
                    command: () => {
                        return this.exchangeExecutionService.execute(parameters);
                    },
                },
            ],
            [
                'passer',
                {
                    format: '^passer$',
                    description: '"!passer" sans majuscule ni espace',
                    command: () => {
                        return this.passExecutionService.execute();
                    },
                },
            ],
            [
                'debug',
                {
                    format: '^debug$',
                    description: '"!debug" sans majuscule ni espace',
                    command: () => {
                        return this.debugExecutionService.execute();
                    },
                },
            ],
            [
                'reserve',
                {
                    format: '^reserve$',
                    description: '"!reserve" sans majuscule ni espace',
                    command: () => {
                        return this.reserveExecutionService.execute();
                    },
                },
            ],
        ]);

        const commandToExecute: () => IChat = this.validateParametersFormat(
            command,
            commandFormatMapping.get(parameters[0]) as { format: string; description: string; command: () => IChat },
        );

        return commandToExecute;
    }

    private validateParametersFormat(command: string, format: { format: string; description: string; command: () => IChat }): () => IChat {
        let regexp: RegExp;
        try {
            regexp = new RegExp(format.format);
        } catch {
            throw new CommandSyntaxError('Commande Invalide');
        }
        const test = regexp.test(command);
        if (!test) {
            throw new CommandSyntaxError(`${format.description}`);
        }
        return format.command;
    }
}
