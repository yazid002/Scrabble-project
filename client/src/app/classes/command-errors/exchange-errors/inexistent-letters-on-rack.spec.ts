import { InexistentLettersOnRack } from './inexistent-letters-on-rack';

describe('InexistentLettersOnRack', () => {
    let inexistentLettersOnRack: InexistentLettersOnRack;

    beforeEach(() => {
        const message = 'erreur de test';
        inexistentLettersOnRack = new InexistentLettersOnRack(message);
    });

    it('should create', () => {
        expect(inexistentLettersOnRack).toBeTruthy();
    });

    it('should contain the right message', () => {
        const expectedResult = "Erreur de syntaxe : Vous n'avez aucune occurrence disponible sur le chevalet pour les lettres: erreur de test";
        expect(inexistentLettersOnRack.message).toBe(expectedResult);
    });
});
