import { NotEnoughOccurrences } from './not-enough-occurrences';

describe('InvalidInput', () => {
    let notEnoughOccurrences: NotEnoughOccurrences;

    beforeEach(() => {
        const message = 'erreur de test';
        notEnoughOccurrences = new NotEnoughOccurrences(message);
    });

    it('should create', () => {
        expect(notEnoughOccurrences).toBeTruthy();
    });

    it('should contain the right message', () => {
        const expectedResult = "Erreur de syntaxe : Il n'y a pas assez d'occurrences sur le chevalet pour les lettres: erreur de test";
        expect(notEnoughOccurrences.message).toBe(expectedResult);
    });
});
