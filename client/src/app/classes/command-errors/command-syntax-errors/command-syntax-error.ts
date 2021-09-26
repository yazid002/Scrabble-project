import { CommandError } from '@app/classes/command-errors/command-error';

export class CommandSyntaxError extends CommandError {
    constructor(message: string) {
        super(message);
        this.name = 'CommandSyntaxError';
        this.message = 'Erreur de syntaxe : ' + message;
    }
}
