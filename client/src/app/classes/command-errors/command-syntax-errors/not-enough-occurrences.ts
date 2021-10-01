import { CommandSyntaxError } from '@app/classes/command-errors/command-syntax-errors/command-syntax-error';

export class NotEnoughOccurrences extends CommandSyntaxError {
    constructor(message: string) {
        super(message);
        this.name = 'NotEnoughOccurrences';
        this.message = "Erreur de syntaxe : Il n'y a pas assez d'occurrences sur le chevalet pour les lettres: " + message;
    }
}
