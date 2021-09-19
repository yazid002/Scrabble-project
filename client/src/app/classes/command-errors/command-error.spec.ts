import { CommandError } from './command-error';

describe('CommandError', () => {
    let commandError: CommandError;

    beforeEach(() => {
        const message = 'erreur de test';
        commandError = new CommandError(message);
    });

    it('should create', () => {
        expect(commandError).toBeTruthy();
    });

    it('should contain the right message', () => {
        const expectedResult = 'Erreur de commande : erreur de test';
        expect(commandError.message).toBe(expectedResult);
    });
});
