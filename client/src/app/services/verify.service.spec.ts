/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { CommandSyntaxError } from '@app/classes/command-errors/command-syntax-errors/command-syntax-error';
import { NotEnoughOccurrences } from '@app/classes/command-errors/command-syntax-errors/not-enough-occurrences';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { Dictionary } from '@app/classes/dictionary';
import { Vec2 } from '@app/classes/vec2';
import { RackService } from '@app/services/rack.service';
import { VerifyService } from '@app/services/verify.service';

describe('VerifyService', () => {
    let service: VerifyService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;

    beforeEach(() => {
        rackServiceSpy = jasmine.createSpyObj('RackService', ['findJokersNumberOnRack', 'isLetterOnRack']);
        // rackServiceSpy.rackLetters = [
        //     { name: 'A', quantity: 9, points: 1, affiche: 'A' },
        //     { name: 'B', quantity: 2, points: 3, affiche: 'B' },
        //     { name: 'C', quantity: 2, points: 3, affiche: 'C' },
        //     { name: 'D', quantity: 3, points: 2, affiche: 'D' },
        //     { name: 'E', quantity: 15, points: 1, affiche: 'E' },
        // ];

        TestBed.configureTestingModule({ providers: [{ provide: RackService, useValue: rackServiceSpy }] });
        service = TestBed.inject(VerifyService);
        const dictionary = {
            title: 'dictionnaire test',
            description: 'description de test',
            words: ['aa', 'finir', 'manger', 'rouler'],
        } as Dictionary;
        service.dictionary = dictionary;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' isWordInDictionary should return true if the word exists in the dictionary', () => {
        const wordToCheck = 'manger';

        // Car isWordInDictionary est privée
        // eslint-disable-next-line dot-notation
        const result = service['isWordInDictionary'](wordToCheck);
        expect(result).toBeTrue();
    });

    it(' isWordInDictionary should return false if the word does not exist in the dictionary', () => {
        const wordToCheck = 'monter';

        // Car isWordInDictionary est privée
        // eslint-disable-next-line dot-notation
        const result = service['isWordInDictionary'](wordToCheck);
        expect(result).toBeFalse();
    });

    it(' normalizeWord should return the word without accents and diacritics', () => {
        const wordToCheck = 'éîöPÑ-è';
        const expectedResult = 'eioPN-e';

        const result = service.normalizeWord(wordToCheck);
        expect(result).toEqual(expectedResult);
    });

    it(' validateInvalidSymbols should return void if the word does not contains invalid symbols', () => {
        const wordToCheck = 'grandfrere';

        // Car checkInvalidSymbols est privée
        // eslint-disable-next-line dot-notation
        const result = service['validateInvalidSymbols'](wordToCheck);
        expect(result).toEqual(void '');
    });

    it(' validateInvalidSymbols should throw an error if the word contains invalid symbols', () => {
        const wordToCheck = 'pa-pa';

        // Car checkInvalidSymbols est privée
        // eslint-disable-next-line dot-notation
        expect(() => service['validateInvalidSymbols'](wordToCheck)).toThrow(new CommandSyntaxError("Les symboles (-) et (') sont invalides."));
    });

    it(' isFirstMove should return true', () => {
        const h8Coord: Vec2 = { x: 7, y: 7 };
        tiles[h8Coord.x][h8Coord.y].letter = '';

        // Car isFirstMove est privée
        // eslint-disable-next-line dot-notation
        const result = service['isFirstMove']();
        expect(result).toBeTrue();
    });

    it(' isFirstMove should return false', () => {
        const h8Coord: Vec2 = { x: 7, y: 7 };
        tiles[h8Coord.x][h8Coord.y].letter = 'A';

        // Car isFirstMove est privée
        // eslint-disable-next-line dot-notation
        const result = service['isFirstMove']();
        expect(result).toBeFalse();
    });

    it(' validateFirstMove should return void if the first move is correct', () => {
        const word = 'moto';
        const coord = { x: 6, y: 7 };
        const direction = 'v';

        // Car validateFirstMove est privée
        // eslint-disable-next-line dot-notation
        const result = service['validateFirstMove'](word, direction, coord);
        expect(result).toEqual(void '');
    });

    it(' validateFirstMove should throw an error if the first move is not correct', () => {
        const word = 'moto';
        const coord = { x: 2, y: 4 };
        const direction = 'v';

        // Car validateFirstMove est privée
        // eslint-disable-next-line dot-notation
        expect(() => service['validateFirstMove'](word, direction, coord)).toThrow(
            new ImpossibleCommand(' Ceci est votre premier tour, au moins une de vos lettres doit être placée sur la case H8'),
        );
    });

    it(' validateJokersOccurrencesMatch should throw an error if the number of jokers provided is more than the number of jokers available', () => {
        const word = 'mOtO';

        rackServiceSpy.findJokersNumberOnRack.and.returnValue(1);

        // Car validateJokersOccurrencesMatch est privée
        // eslint-disable-next-line dot-notation
        expect(() => service['validateJokersOccurrencesMatch'](word)).toThrow(
            new NotEnoughOccurrences(' * (lettres blanches) représentant les lettres "O", "O" demandées.'),
        );
    });

    it(' validateJokersOccurrencesMatch should return void if the number of jokers provided is equal to the number of jokers available', () => {
        const word = 'mOto';

        rackServiceSpy.findJokersNumberOnRack.and.returnValue(1);

        // Car validateJokersOccurrencesMatch est privée
        // eslint-disable-next-line dot-notation
        const result = service['validateJokersOccurrencesMatch'](word);
        expect(result).toEqual(void '');
    });

    it(' validateJokersOccurrencesMatch should return void if the number of jokers provided is less than the number of jokers available', () => {
        const word = 'mOt';

        rackServiceSpy.findJokersNumberOnRack.and.returnValue(2);

        // Car validateJokersOccurrencesMatch est privée
        // eslint-disable-next-line dot-notation
        const result = service['validateJokersOccurrencesMatch'](word);
        expect(result).toEqual(void '');
    });

    it(' isLetterOnBoardTheSame should return true', () => {
        const letterOnBoard = 'A';
        const letterToPlace = 'A';

        // Car isFirstMove est privée
        // eslint-disable-next-line dot-notation
        const result = service['isLetterOnBoardTheSame'](letterOnBoard, letterToPlace);
        expect(result).toBeTrue();
    });

    it(' isLetterOnBoardTheSame should return false', () => {
        const letterOnBoard = 'A';
        const letterToPlace = 'B';

        // Car isLetterOnBoardTheSame est privée
        // eslint-disable-next-line dot-notation
        const result = service['isLetterOnBoardTheSame'](letterOnBoard, letterToPlace);
        expect(result).toBeFalse();
    });

    it(' isCaseEmpty should return false', () => {
        const letterOnBoard = 'A';

        // Car isCaseEmpty est privée
        // eslint-disable-next-line dot-notation
        const result = service['isCaseEmpty'](letterOnBoard);
        expect(result).toBeFalse();
    });

    it(' isCaseEmpty should return true', () => {
        const letterOnBoard = '';

        // Car isCaseEmpty est privée
        // eslint-disable-next-line dot-notation
        const result = service['isCaseEmpty'](letterOnBoard);
        expect(result).toBeTrue();
    });

    it(' findAdjacentUp should return true', () => {
        const coord = { x: 1, y: 4 };
        tiles[coord.x - 1][coord.y].letter = 'a';

        // Car findAdjacentUp est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentUp'](coord);
        expect(result).toBeTrue();
    });

    it(' findAdjacentUp should return false if the letter is place at the extreme top of the board', () => {
        const coord = { x: 0, y: 4 };

        // Car findAdjacentUp est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentUp'](coord);
        expect(result).toBeFalse();
    });

    it(' findAdjacentUp should return false if the letter is not place at the extreme top of the board and there is no letter above', () => {
        const coord = { x: 1, y: 4 };
        tiles[coord.x - 1][coord.y].letter = '';

        // Car findAdjacentUp est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentUp'](coord);
        expect(result).toBeFalse();
    });

    it(' findAdjacentDown should return true', () => {
        const coord = { x: 13, y: 4 };
        tiles[coord.x + 1][coord.y].letter = 'a';

        // Car findAdjacentDown est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentDown'](coord);
        expect(result).toBeTrue();
    });

    it(' findAdjacentDown should return false if the letter is place at the extreme bottom of the board', () => {
        const coord = { x: 14, y: 4 };

        // Car findAdjacentDown est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentDown'](coord);
        expect(result).toBeFalse();
    });

    it(
        ' findAdjacentDown should return false if the letter is not place at the extreme bottom of' +
            ' the board and there is no letter bottom of it',
        () => {
            const coord = { x: 13, y: 4 };
            tiles[coord.x + 1][coord.y].letter = '';

            // Car findAdjacentUp est privée
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentDown'](coord);
            expect(result).toBeFalse();
        },
    );

    it(' findAdjacentRight should return true', () => {
        const coord = { x: 1, y: 13 };
        tiles[coord.x][coord.y + 1].letter = 'a';

        // Car findAdjacentRight est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentRight'](coord);
        expect(result).toBeTrue();
    });

    it(' findAdjacentRight should return false if the letter is place on the extreme right of the board', () => {
        const coord = { x: 0, y: 14 };

        // Car findAdjacentRight est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentRight'](coord);
        expect(result).toBeFalse();
    });

    it(
        ' findAdjacentRight should return false if the letter is not place at the extreme right' +
            ' of the board and there is no letter on its right',
        () => {
            const coord = { x: 1, y: 13 };
            tiles[coord.x][coord.y + 1].letter = '';

            // Car findAdjacentRight est privée
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentRight'](coord);
            expect(result).toBeFalse();
        },
    );

    it(' findAdjacentLeft should return true', () => {
        const coord = { x: 1, y: 1 };
        tiles[coord.x][coord.y - 1].letter = 'a';

        // Car findAdjacentLeft est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentLeft'](coord);
        expect(result).toBeTrue();
    });

    it(' findAdjacentLeft should return false if the letter is place on the extreme left of the board', () => {
        const coord = { x: 0, y: 0 };

        // Car findAdjacentRight est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentLeft'](coord);
        expect(result).toBeFalse();
    });

    it(' hasAdjacent should return true any of the letter was already on the board', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';

        // Car isCaseEmpty est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isCaseEmpty').and.returnValue(false);

        // Car hasAdjacent est privée
        // eslint-disable-next-line dot-notation
        const result = service['hasAdjacent'](word, coord, direction);
        expect(result).toBeTrue();
    });

    it(' hasAdjacent should return true if any of the letter has a top adjacent', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';

        // Car findAdjacentUp est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findAdjacentUp').and.returnValue(true);

        // Car hasAdjacent est privée
        // eslint-disable-next-line dot-notation
        const result = service['hasAdjacent'](word, coord, direction);
        expect(result).toBeTrue();
    });

    it(' hasAdjacent should return true if any of the letter has a left adjacent', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';

        // Car findAdjacentUp est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findAdjacentLeft').and.returnValue(true);

        // Car hasAdjacent est privée
        // eslint-disable-next-line dot-notation
        const result = service['hasAdjacent'](word, coord, direction);
        expect(result).toBeTrue();
    });

    it(' hasAdjacent should return true if any of the letter has a right adjacent', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';

        // Car findAdjacentRight est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findAdjacentRight').and.returnValue(true);

        // Car hasAdjacent est privée
        // eslint-disable-next-line dot-notation
        const result = service['hasAdjacent'](word, coord, direction);
        expect(result).toBeTrue();
    });

    it(' hasAdjacent should return true if any of the letter has a bottom adjacent', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';

        // Car findAdjacentRight est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findAdjacentDown').and.returnValue(true);

        // Car hasAdjacent est privée
        // eslint-disable-next-line dot-notation
        const result = service['hasAdjacent'](word, coord, direction);
        expect(result).toBeTrue();
    });

    it(' hasAdjacent should return false if none of the letter was on the board or has adjacent', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';

        // Car findAdjacentRight est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findAdjacentDown').and.returnValue(false);

        // Car findAdjacentRight est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findAdjacentRight').and.returnValue(false);

        // Car findAdjacentRight est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findAdjacentLeft').and.returnValue(false);

        // Car findAdjacentUp est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findAdjacentUp').and.returnValue(false);

        // Car isCaseEmpty est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isCaseEmpty').and.returnValue(true);

        // Car hasAdjacent est privée
        // eslint-disable-next-line dot-notation
        const result = service['hasAdjacent'](word, coord, direction);
        expect(result).toBeFalse();
    });

    it(
        ' validatePlaceFeasibility should call validateInvalidSymbols, validateJokersOccurrencesMatch,' +
            ' isFitting if there is adjacency and no firstMove error',
        () => {
            const coord = { x: 1, y: 1 };
            const word = 'moto';
            const direction = 'v';
            tiles[7][7].letter = 'A';

            // Car isFirstMove est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isFirstMove').and.returnValue(false);

            // Car validateInvalidSymbols est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validateInvalidSymbolsSpy = spyOn<any>(service, 'validateInvalidSymbols').and.returnValue(void '');

            // Car validateJokersOccurrencesMatch est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validateJokersOccurrencesMatchSpy = spyOn<any>(service, 'validateJokersOccurrencesMatch').and.returnValue(void '');

            // Car isFitting est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isFittingSpy = spyOn<any>(service, 'isFitting').and.returnValue([]);

            // Car hasAdjacent est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'hasAdjacent').and.returnValue(true);

            service.validatePlaceFeasibility(word, coord, direction);
            expect(validateInvalidSymbolsSpy).toHaveBeenCalled();
            expect(validateJokersOccurrencesMatchSpy).toHaveBeenCalled();
            expect(isFittingSpy).toHaveBeenCalled();
        },
    );

    it(' validatePlaceFeasibility should call validateFirstMove if it is the first move', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';

        // Car isFirstMove est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isFirstMove').and.returnValue(true);

        // Car validateInvalidSymbols est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'validateInvalidSymbols').and.returnValue(void '');

        // Car validateJokersOccurrencesMatch est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'validateJokersOccurrencesMatch').and.returnValue(void '');

        // Car isFitting est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isFitting').and.returnValue([]);

        // Car validateFirstMove est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validateFirstMoveSpy = spyOn<any>(service, 'validateFirstMove').and.returnValue(void '');

        service.validatePlaceFeasibility(word, coord, direction);
        expect(validateFirstMoveSpy).toHaveBeenCalled();
    });

    it(' validatePlaceFeasibility should call hasAdjacent if it is not the first move', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';
        tiles[7][7].letter = 'A';

        // Car isFirstMove est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isFirstMove').and.returnValue(false);

        // Car validateInvalidSymbols est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'validateInvalidSymbols').and.returnValue(void '');

        // Car validateJokersOccurrencesMatch est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'validateJokersOccurrencesMatch').and.returnValue(void '');

        // Car isFitting est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isFitting').and.returnValue([]);

        // Car validateFirstMove est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validateFirstMoveSpy = spyOn<any>(service, 'validateFirstMove').and.returnValue(void '');

        // Car hasAdjacent est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hasAdjacentSpy = spyOn<any>(service, 'hasAdjacent').and.returnValue(true);

        service.validatePlaceFeasibility(word, coord, direction);
        expect(validateFirstMoveSpy).not.toHaveBeenCalled();
        expect(hasAdjacentSpy).toHaveBeenCalled();
    });

    it(' validatePlaceFeasibility should throw error if it is not the first move and the word has no adjacent', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';

        // Car isFirstMove est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isFirstMove').and.returnValue(false);

        // Car hasAdjacent est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'hasAdjacent').and.returnValue(false);

        expect(() => service.validatePlaceFeasibility(word, coord, direction)).toThrow(
            new ImpossibleCommand('Vous devez placer un mot ayant au moins une lettre adjacente aux lettres du plateau de jeu.'),
        );
    });

    it(' findHorizontalAdjacentWord should return an empty string if the text at the given coords is a bonus', () => {
        const coord = { x: 1, y: 1 };
        tiles[coord.x][coord.y].text = 'dl';

        // eslint-disable-next-line dot-notation
        const result = service['findHorizontalAdjacentWord'](coord);

        expect(result).toEqual('');
    });

    it(' findHorizontalAdjacentWord should return the right word if coords are on the left', () => {
        const coord = { x: 1, y: 6 };
        tiles[coord.x][coord.y - 1].text = '';
        tiles[coord.x][coord.y].text = 'p';
        tiles[coord.x][coord.y + 1].text = 'u';
        tiles[coord.x][coord.y + 2].text = 'dl';

        // Car findHorizontalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findHorizontalAdjacentWord'](coord);

        const expectedResult = 'pu';

        expect(result).toEqual(expectedResult);
    });

    it(' findHorizontalAdjacentWord should return the right word if coords are in the middle', () => {
        const coord = { x: 1, y: 5 };
        tiles[coord.x][coord.y - 2].text = 'dl';
        tiles[coord.x][coord.y - 1].text = 'p';
        tiles[coord.x][coord.y].text = 'u';
        tiles[coord.x][coord.y + 1].text = 'u';
        tiles[coord.x][coord.y + 2].text = '';

        // Car findHorizontalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findHorizontalAdjacentWord'](coord);

        const expectedResult = 'puu';

        expect(result).toEqual(expectedResult);
    });

    it(' findHorizontalAdjacentWord should return the right word if coords are on the left', () => {
        const coord = { x: 1, y: 5 };
        tiles[coord.x][coord.y - 3].text = '';
        tiles[coord.x][coord.y - 2].text = 'o';
        tiles[coord.x][coord.y - 1].text = 'i';
        tiles[coord.x][coord.y].text = 's';
        tiles[coord.x][coord.y + 1].text = '';

        // Car findHorizontalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findHorizontalAdjacentWord'](coord);

        const expectedResult = 'ois';

        expect(result).toEqual(expectedResult);
    });

    it(' findVerticalAdjacentWord should return an empty string if the text at the given coords is a bonus', () => {
        const coord = { x: 1, y: 1 };
        tiles[coord.x][coord.y].text = 'dl';

        // Car findVerticalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findVerticalAdjacentWord'](coord);

        const expectedResult = '';

        expect(result).toEqual(expectedResult);
    });

    it(' findVerticalAdjacentWord should return the right word if coords are on the top', () => {
        const coord = { x: 1, y: 6 };
        tiles[coord.x - 1][coord.y].text = '';
        tiles[coord.x][coord.y].text = 'p';
        tiles[coord.x + 1][coord.y].text = 'u';
        tiles[coord.x + 2][coord.y].text = 'dl';

        // Car findVerticalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findVerticalAdjacentWord'](coord);

        const expectedResult = 'pu';

        expect(result).toEqual(expectedResult);
    });

    it(' findVerticalAdjacentWord should return the right word if coords are in the middle', () => {
        const coord = { x: 10, y: 5 };
        tiles[coord.x - 2][coord.y].text = 'dl';
        tiles[coord.x - 1][coord.y].text = 'p';
        tiles[coord.x][coord.y].text = 'u';
        tiles[coord.x + 1][coord.y].text = 'u';
        tiles[coord.x + 2][coord.y].text = '';

        // Car findVerticalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findVerticalAdjacentWord'](coord);

        const expectedResult = 'puu';

        expect(result).toEqual(expectedResult);
    });

    it(' findVerticalAdjacentWord should return the right word if coords are on the bottom', () => {
        const coord = { x: 11, y: 5 };
        tiles[coord.x - 3][coord.y].text = '';
        tiles[coord.x - 2][coord.y].text = 'o';
        tiles[coord.x - 1][coord.y].text = 'i';
        tiles[coord.x][coord.y].text = 's';
        tiles[coord.x + 1][coord.y].text = '';

        // Car findVerticalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findVerticalAdjacentWord'](coord);

        const expectedResult = 'ois';

        expect(result).toEqual(expectedResult);
    });

    it(' computeCoordByDirection should return the same y but the x should be added with step if direction is v', () => {
        const coord = { x: 11, y: 5 };
        const direction = 'v';
        const step = 2;

        const result = service.computeCoordByDirection(direction, coord, step);

        const expectedResult = { x: coord.x + step, y: coord.y };

        expect(result).toEqual(expectedResult);
    });

    it(' computeCoordByDirection should return the same x but the y should be added with step if direction is h', () => {
        const coord = { x: 11, y: 5 };
        const direction = 'h';
        const step = 2;

        const result = service.computeCoordByDirection(direction, coord, step);

        const expectedResult = { x: coord.x, y: coord.y + step };

        expect(result).toEqual(expectedResult);
    });

    it(' checkAllWordsExist should return an error if it is first move and the given word length is less than 2', () => {
        const coord = { x: 1, y: 1 };
        const word = 'm';

        // Car isFirstMove est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isFirstMove').and.returnValue(true);

        const expectedResult = {
            wordExists: false,
            errorMessage: `il vous faut former des mots d'une longueur minimale de 2, mais le mot ${word} a une longueur de 1.`,
        };

        const result = service.checkAllWordsExist(word, coord);
        expect(result).toEqual(expectedResult);
    });

    it(
        ' checkAllWordsExist should return an error if findHorizontalAdjacentWord' +
            ' return a word that length is less more than 2 and does not exist in the dictionary',
        () => {
            const coord = { x: 1, y: 1 };
            const word = 'mmm';

            // Car isFirstMove est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isFirstMove').and.returnValue(false);

            // Car findHorizontalAdjacentWord est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findHorizontalAdjacentWord').and.returnValue(word);

            const expectedResult = { wordExists: false, errorMessage: `le mot ${word} n'existe pas dans le dictionnaire` };

            const result = service.checkAllWordsExist(word, coord);
            expect(result).toEqual(expectedResult);
        },
    );

    it(
        ' checkAllWordsExist should return an error if findVerticalAdjacentWord' +
            ' return a word that length is less more than 2 and does not exist in the dictionary',
        () => {
            const coord = { x: 1, y: 1 };
            const word = 'papa';
            const horizontalWord = 'finir';
            const verticalWord = 'mmm';

            // Car isFirstMove est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isFirstMove').and.returnValue(false);

            // Car findHorizontalAdjacentWord est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findHorizontalAdjacentWord').and.returnValue(horizontalWord);

            // Car findVerticalAdjacentWord est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findVerticalAdjacentWord').and.returnValue(verticalWord);

            const expectedResult = { wordExists: false, errorMessage: `le mot ${verticalWord} n'existe pas dans le dictionnaire` };

            const result = service.checkAllWordsExist(word, coord);
            expect(result).toEqual(expectedResult);
        },
    );

    it(' checkAllWordsExist should return true if the words exist', () => {
        const coord = { x: 1, y: 1 };
        const word = 'papa';
        const horizontalWord = 'finir';
        const verticalWord = 'manger';

        // Car isFirstMove est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isFirstMove').and.returnValue(false);

        // Car findHorizontalAdjacentWord est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findHorizontalAdjacentWord').and.returnValue(horizontalWord);

        // Car findVerticalAdjacentWord est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'findVerticalAdjacentWord').and.returnValue(verticalWord);

        const expectedResult = { wordExists: true, errorMessage: '' };

        const result = service.checkAllWordsExist(word, coord);
        expect(result).toEqual(expectedResult);
    });

    it(' isFitting should throw an error there is not enough space for the word horizontally', () => {
        const coord = { x: 1, y: 13 };
        const word = 'papa';
        const direction = 'h';

        expect(() => service.isFitting(coord, direction, word)).toThrow(new ImpossibleCommand("Il n'y a pas assez de place pour écrire ce mot"));
    });

    it(' isFitting should throw an error there is not enough space for the word vertically', () => {
        const coord = { x: 14, y: 1 };
        const word = 'papa';
        const direction = 'v';

        expect(() => service.isFitting(coord, direction, word)).toThrow(new ImpossibleCommand("Il n'y a pas assez de place pour écrire ce mot"));
    });

    it(' isFitting should throw an error there are letters that are not on the rack nor on the board', () => {
        const coord = { x: 9, y: 1 };
        const word = 'papa';
        const direction = 'v';

        // Car isCaseEmpty est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isCaseEmpty').and.returnValue(true);

        rackServiceSpy.isLetterOnRack.and.returnValue(false);

        expect(() => service.isFitting(coord, direction, word)).toThrow(
            new ImpossibleCommand('Il y a des lettres qui ne sont ni sur le plateau de jeu, ni sur le chevalet'),
        );
    });

    it(' isFitting should throw an error there are letters on the board where we want to place and if there are not the same than ours', () => {
        const coord = { x: 9, y: 1 };
        const word = 'papa';
        const direction = 'v';

        // Car isCaseEmpty est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isCaseEmpty').and.returnValue(false);

        // Car isLetterOnBoardTheSame est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isLetterOnBoardTheSame').and.returnValue(false);

        expect(() => service.isFitting(coord, direction, word)).toThrow(
            new ImpossibleCommand("Il y a déjà une lettre dans l'une des cases ciblées."),
        );
    });

    it(' isFitting should return the letters that were on the board and that we used in our placement', () => {
        const coord = { x: 9, y: 1 };
        const word = 'papa';
        const direction = 'v';

        // Car isCaseEmpty est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isCaseEmpty').and.returnValue(false);

        // Car isLetterOnBoardTheSame est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isLetterOnBoardTheSame').and.returnValue(true);

        const result = service.isFitting(coord, direction, word);
        const expectedResult = [
            { letter: 'p', coord: { x: 9, y: 1 } },
            { letter: 'a', coord: { x: 10, y: 1 } },
            { letter: 'p', coord: { x: 11, y: 1 } },
            { letter: 'a', coord: { x: 12, y: 1 } },
        ];

        expect(result).toEqual(expectedResult);
    });
});
