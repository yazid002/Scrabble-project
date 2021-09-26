import { InvalidInput } from './invalid-input';

describe('InvalidInput', () => {
    let invalidInput: InvalidInput;

    beforeEach(() => {
        const message = 'erreur de test';
        invalidInput = new InvalidInput(message);
    });

    it('should create', () => {
        expect(invalidInput).toBeTruthy();
    });

    it('should contain the right message', () => {
        const expectedResult = 'Entrée invalide : erreur de test';
        expect(invalidInput.message).toBe(expectedResult);
    });
});
