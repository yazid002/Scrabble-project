export class CommandError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CommandError';
        this.message = 'Erreur de commande : ' + message;
    }
}
