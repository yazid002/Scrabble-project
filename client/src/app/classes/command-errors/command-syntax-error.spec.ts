import { CommandSyntaxError } from './command-syntax-error';

describe('InvalidInput', () => {
    let commandSyntaxError: CommandSyntaxError;

    beforeEach(() => {
        const message = 'erreur de test';
        commandSyntaxError = new CommandSyntaxError(message);
    });

    it('should create', () => {
        expect(commandSyntaxError).toBeTruthy();
    });

    // it('should contain the right message', () => {
    //     const expectedResult = 'Erreur de syntaxe : erreur de test';
    //     expect(commandSyntaxError.message).toBe(expectedResult);
    // });
});
