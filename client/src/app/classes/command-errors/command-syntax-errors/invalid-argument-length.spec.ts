import { InvalidArgumentsLength } from './invalid-argument-length';

describe('InvalidArgumentsLength', () => {
    let invalidArgumentsLength: InvalidArgumentsLength;

    beforeEach(() => {
        const message = 'erreur de test';
        invalidArgumentsLength = new InvalidArgumentsLength(message);
    });

    it('should create', () => {
        expect(invalidArgumentsLength).toBeTruthy();
    });

    it('should contain the right message', () => {
        const expectedResult = 'Erreur de syntaxe : Vous avez spécifié soit 0 lettre, soit plus de 7 lettres à échanger. erreur de test';
        expect(invalidArgumentsLength.message).toBe(expectedResult);
    });
});
