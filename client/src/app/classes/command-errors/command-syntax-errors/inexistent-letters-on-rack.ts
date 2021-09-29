import { CommandSyntaxError } from '@app/classes/command-errors/command-syntax-errors/command-syntax-error';

export class InexistentLettersOnRack extends CommandSyntaxError {
    constructor(message: string) {
        super(message);
        this.name = 'InexistentLettersOnRack';
        this.message = "Erreur de syntaxe : Vous n'avez aucune occurrence disponible sur le chevalet pour les lettres: " + message;
    }
}
