import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { CommandError } from '@app/classes/command-errors/command-error';
import { CommandSyntaxError } from '@app/classes/command-errors/command-syntax-errors/command-syntax-error';
import { InvalidInput } from '@app/classes/command-errors/invalid-input/invalid-input';
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
    async interpretCommand(command: string): Promise<IChat> {
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

        const commandFormatMapping: Map<string, { format: string; description: string }> = new Map([
            [
                'placer',
                {
                    // TO DO: Fait en considérant que la ligne est en minuscule, si cela n'a pas d'importance (maj ou min),
                    // remplacer [a-z] par [A-Za-z]
                    format: '^placer[\\s][a-o]{1}([0-9]{1}|1[0-5]{1})(h|v)[\\s][^ ]{1,15}$',
                    description:
                        '"!placer &lt;ligne&gt;&lt;colonne&gt;(h|v) &lt;mot&gt;" sans espace à la fin, avec la ligne de a à o,' +
                        ' la colonne de 1 à 15 et le mot composé de 1 à 15 caractères',
                },
            ],
            [
                'echanger',
                {
                    format: '^echanger[\\s][a-z*]{1,7}$',
                    description:
                        '"!echanger &lt;arguments&gt;" sans majuscule ni espace entre les lettres à échanger ni à la fin.' +
                        ' Indiquez 1 à 7 lettres à échanger',
                },
            ],
            ['passer', { format: '^passer$', description: '"!passer" sans majuscule ni espace à la fin' }],
            ['debug', { format: '^debug$', description: '"!debug" sans majuscule ni espace  à la fin' }],
            ['reserve', { format: '^reserve$', description: '"!reserve" sans majuscule ni espace  à la fin' }],
        ]);

        const parameters: string[] = command.split(' ');

        const result: IChat = {
            from: SENDER.computer,
            body: 'Went through the command execution service',
        };

        try {
            switch (parameters[0]) {
                case 'placer':
                    this.validateParametersFormat(command, commandFormatMapping.get('placer') as { format: string; description: string });
                    return this.placeExecutionService.execute(parameters);
                case 'echanger':
                    this.validateParametersFormat(command, commandFormatMapping.get('echanger') as { format: string; description: string });
                    return this.exchangeExecutionService.execute(parameters);
                case 'passer':
                    this.validateParametersFormat(command, commandFormatMapping.get('passer') as { format: string; description: string });
                    return this.passExecutionService.execute();
                case 'debug':
                    this.validateParametersFormat(command, commandFormatMapping.get('debug') as { format: string; description: string });
                    return this.debugExecutionService.execute();
                case 'reserve':
                    this.validateParametersFormat(command, commandFormatMapping.get('reserve') as { format: string; description: string });
                    return this.reserveExecutionService.execute();
                default:
                    throw new InvalidInput('Les commandes disponibles sont "placer", "echanger", "passer", "debug" et "reserve"');
            }
        } catch (error) {
            if (error instanceof CommandError) {
                result.body = error.message;
                return result;
            } else {
                throw error;
            }
        }
    }

    private validateParametersFormat(command: string, format: { format: string; description: string }): void {
        const regexp = new RegExp(format.format);
        const test = regexp.test(command);
        if (!test) {
            throw new CommandSyntaxError(`Le bon format de commande est: ${format.description}.`);
        }
    }
}
