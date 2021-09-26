import { CommandError } from './command-error';

export class ImpossibleCommand extends CommandError {
    constructor(message: string) {
        super(message);
        this.name = 'ImpossibleCommand';
        this.message = 'Commande impossible à réaliser : ' + message;
    }
}
