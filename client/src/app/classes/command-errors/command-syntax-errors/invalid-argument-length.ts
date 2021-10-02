import { CommandSyntaxError } from '@app/classes/command-errors/command-syntax-errors/command-syntax-error';

export class InvalidArgumentsLength extends CommandSyntaxError {
    constructor(message: string) {
        super(message);
        this.name = 'InvalidArgumentsLength';
        this.message = 'Erreur de syntaxe : Vous avez spécifié soit 0 lettre, soit plus de 7 lettres à échanger. ' + message;
    }
}
