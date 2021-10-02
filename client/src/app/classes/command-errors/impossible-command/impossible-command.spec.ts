import { ImpossibleCommand } from './impossible-command';

describe('InvalidInput', () => {
    let impossibleCommand: ImpossibleCommand;

    beforeEach(() => {
        const message = 'erreur de test';
        impossibleCommand = new ImpossibleCommand(message);
    });

    it('should create', () => {
        expect(impossibleCommand).toBeTruthy();
    });

    it('should contain the right message', () => {
        const expectedResult = 'Commande impossible à réaliser : erreur de test';
        expect(impossibleCommand.message).toBe(expectedResult);
    });
});
