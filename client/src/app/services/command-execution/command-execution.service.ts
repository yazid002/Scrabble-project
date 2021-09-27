import { Injectable } from '@angular/core';
import { IChat } from '@app/classes/chat';
import { CommandSyntaxError } from '@app/classes/command-errors/command-syntax-errors/command-syntax-error';
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
        public debugExecutionService: DebugExecutionService,

        private passExecutionService: PassExecutionService,
        private exchangeExecutionService: ExchangeExecutionService,
    ) {}
    interpretCommand(command: string) {
        this.findCommand(command);
    }
    async executeCommand(command: string): Promise<IChat> {
        const functionToExecute: () => IChat = this.findCommand(command);
        return functionToExecute();
    }
    private findCommand(command: string): () => IChat {
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
        const commandFormatMapping: Map<string, { format: string; description: string; command: () => Promise<IChat> | IChat }> = new Map([
            [
                'placer',
                {
                    // TO DO: Fait en considérant que la ligne est en minuscule, si cela n'a pas d'importance (maj ou min),
                    // remplacer [a-z] par [A-Za-z]
                    format: '^placer[\\s][a-o]{1}([0-9]{1}|1[0-5]{1})(h|v)[\\s][^ ]{1,15}$',
                    description:
                        '"!placer &lt;ligne&gt;&lt;colonne&gt;(h|v) &lt;mot&gt;" sans espace à la fin, avec la ligne de a à o,' +
                        ' la colonne de 1 à 15 et le mot composé de 1 à 15 caractères',
                    command: async () => {
                        return this.placeExecutionService.execute(parameters);
                    },
                },
            ],
            [
                'echanger',
                {
                    format: '^echanger[\\s][a-z*]{1,7}$',
                    description:
                        '"!echanger &lt;arguments&gt;" sans majuscule ni espace entre les lettres à échanger ni à la fin.' +
                        ' Indiquez 1 à 7 lettres à échanger',
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
