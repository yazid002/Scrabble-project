import { CommandError } from './command-error';

export class CommandSyntaxError extends CommandError {
    constructor(message: string) {
        super(message);
        this.name = 'CommandSyntaxError';
        this.message = 'Erreur de syntaxe : ' + message;
    }
}
// CommandSyntaxError.prototype = new Error();
