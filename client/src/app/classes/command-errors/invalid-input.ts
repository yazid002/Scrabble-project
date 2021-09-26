import { CommandError } from './command-error';

export class InvalidInput extends CommandError {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidInput';
        this.message = 'Entrée invalide : ' + message;
    }
}
