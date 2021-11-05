import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { CommandFormat } from '@app/classes/command-format';
import { PLAYER } from '@app/classes/player';
import { GameService } from '@app/services/game.service';
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
        private gameService: GameService,
    ) {}
    interpretCommand(command: string): { error: boolean; function: () => Promise<IChat> } {
        const answer = this.findCommand(command, true);
        return answer;
    }
    async executeCommand(command: string, isCalledThoughtChat: boolean): Promise<{ error: boolean; message: IChat }> {
        const answer = this.findCommand(command, isCalledThoughtChat);
        return { error: answer.error, message: await answer.function() };
    }
    private findCommand(command: string, isCalledThoughtChat: boolean): { error: boolean; function: () => Promise<IChat> } {
        /**
         * Tente de trouver la bonne commande a exécuter. S'il ne trouve pas la commande, alors la commande * donnée en paramètre n'est pas valide.
         */

        /*
         Formatter la commande pour avoir un traitement prévisible
         Commande trouvés sur:  https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        */
        command = command
            .replace('!', '')
            .replace('\n', '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        const allowedTurn = this.gameService.currentTurn === PLAYER.realPlayer;
        const parameters: string[] = command.split(' ');
        const commandFormatMapping: Map<string, CommandFormat> = new Map([
            [
                'placer',
                {
                    format: '^placer[\\s][a-o]{1}([0-9]{1}|1[0-5]{1})(h|v)[\\s][^ ]{1,15}$',
                    description: 'Ligne(a-o)Colone(1-15)Sens(h|v) mot',
                    allowed: allowedTurn,
                    notAllowedMessage: "Ce n'est pas votre tours",
                    command: async () => {
                        return this.placeExecutionService.execute(parameters, isCalledThoughtChat);
                    },
                },
            ],
            [
                'echanger',
                {
                    format: '^echanger[\\s][a-z*]{1,7}$',
                    description: 'l<sub>1</sub>l<sub>2</sub>l<sub>3</sub>...l<sub>n</sub>',
                    allowed: allowedTurn,
                    notAllowedMessage: "Ce n'est pas votre tours",
                    command: async () => {
                        return await this.exchangeExecutionService.execute(parameters, isCalledThoughtChat);
                    },
                },
            ],
            [
                'passer',
                {
                    format: '^passer$',
                    description: '"!passer" sans majuscule ni espace à la fin',
                    allowed: allowedTurn,
                    notAllowedMessage: "Ce n'est pas votre tours",
                    command: async () => {
                        return await this.passExecutionService.execute();
                    },
                },
            ],
            [
                'debug',
                {
                    format: '^debug$',
                    description: '"!debug" sans majuscule ni espace à la fin',
                    allowed: true,
                    notAllowedMessage: '',
                    command: async () => {
                        return await this.debugExecutionService.execute();
                    },
                },
            ],
            [
                'reserve',
                {
                    format: '^reserve$',
                    description: '"!reserve" sans majuscule ni espace à la fin',
                    allowed: this.debugExecutionService.state,
                    notAllowedMessage: '<strong>debug</strong> doit être activé',
                    command: async () => {
                        return await this.reserveExecutionService.execute();
                    },
                },
            ],
        ]);

        const commandToExecute: { error: boolean; function: () => Promise<IChat> } = this.validateParametersFormat(
            command,
            commandFormatMapping.get(parameters[0]) as CommandFormat,
        );

        return commandToExecute;
    }

    private validateParametersFormat(command: string, format: CommandFormat): { error: boolean; function: () => Promise<IChat> } {
        let regexp: RegExp;
        const answer: IChat = { from: SENDER.computer, body: '' };
        let error = false;
        try {
            regexp = new RegExp(format.format);
            const test = regexp.test(command);
            if (!test) {
                answer.body = format.description;
                error = true;
                return { error, function: async () => answer };
            }
            if (!format.allowed) {
                error = true;
                answer.body = format.notAllowedMessage;
                return { error, function: async () => answer };
            }
        } catch {
            error = true;
            answer.body = 'Commande Invalide';
            return { error, function: async () => answer };
        }
        return { error, function: format.command };
    }
}
