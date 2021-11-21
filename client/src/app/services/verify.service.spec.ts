/* eslint-disable max-lines */
import { HttpClientTestingModule /* , HttpTestingController*/ } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { IChat, SENDER } from '@app/classes/chat';
import { Dictionary } from '@app/classes/dictionary';
import { Vec2 } from '@app/classes/vec2';
import { RackService } from '@app/services/rack.service';
import { VerifyService } from '@app/services/verify.service';

describe('VerifyService', () => {
    let service: VerifyService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    // let httpMock: HttpTestingController;
    // let baseUrl: string;
    beforeEach(() => {
        rackServiceSpy = jasmine.createSpyObj('RackService', ['findJokersNumberOnRack', 'isLetterOnRack']);

        TestBed.configureTestingModule({ providers: [{ provide: RackService, useValue: rackServiceSpy }], imports: [HttpClientTestingModule] });
        service = TestBed.inject(VerifyService);
        const dictionary = {
            title: 'dictionnaire test',
            description: 'description de test',
            words: ['aa', 'finir', 'manger', 'rouler'],
        } as Dictionary;
        service.dictionary = dictionary;
        // baseUrl = service.urlString;
        // httpMock = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' normalizeWord should return the word without accents and diacritics', () => {
        const wordToCheck = 'éîöPÑ-è';
        const expectedResult = 'eioPN-e';

        const result = service.normalizeWord(wordToCheck);
        expect(result).toEqual(expectedResult);
    });

    it(' validateInvalidSymbols should return an error false if the word does not contains invalid symbols', () => {
        const wordToCheck = 'grandfrere';

        // Car checkInvalidSymbols est privée
        // eslint-disable-next-line dot-notation
        const result = service['validateInvalidSymbols'](wordToCheck);
        expect(result.error).toEqual(false);
    });

    it(' validateInvalidSymbols should an error true if the word contains invalid symbols', () => {
        const wordToCheck = 'pa-pa';

        // Car checkInvalidSymbols est privée
        // eslint-disable-next-line dot-notation
        const result = service['validateInvalidSymbols'](wordToCheck);
        expect(result.error).toEqual(true);
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

    it(' validateFirstMove should return an error false if the first move is correct', () => {
        const word = 'moto';
        const coord = { x: 7, y: 6 };
        const direction = 'v';

        // Car validateFirstMove est privée
        // eslint-disable-next-line dot-notation
        const result = service['validateFirstMove'](word, direction, coord);
        expect(result.error).toEqual(false);
    });

    it(' validateFirstMove should return an error true if the first move is not correct', () => {
        const word = 'moto';
        const coord = { x: 2, y: 4 };
        const direction = 'v';

        // Car validateFirstMove est privée
        // eslint-disable-next-line dot-notation
        const result = service['validateFirstMove'](word, direction, coord);
        expect(result.error).toEqual(true);
    });

    it(
        ' validateJokersOccurrencesMatch should return a response error true' +
            ' if the number of jokers provided is more than the number of jokers available',
        () => {
            const word = 'mOtO';
            const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

            rackServiceSpy.findJokersNumberOnRack.and.returnValue(1);

            // Car validateJokersOccurrencesMatch est privée
            // eslint-disable-next-line dot-notation
            const result = service['validateJokersOccurrencesMatch'](word, lettersUsedOnBoard);
            expect(result.error).toEqual(true);
        },
    );

    it(
        ' validateJokersOccurrencesMatch should return a response error false' +
            ' if the number of jokers provided is equal to the number of jokers available',
        () => {
            const word = 'mOto';
            const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

            rackServiceSpy.findJokersNumberOnRack.and.returnValue(1);

            // Car validateJokersOccurrencesMatch est privée
            // eslint-disable-next-line dot-notation
            const result = service['validateJokersOccurrencesMatch'](word, lettersUsedOnBoard);
            expect(result.error).toEqual(false);
        },
    );

    it(
        ' validateJokersOccurrencesMatch should return a response error false ' +
            ' if the number of jokers provided is less than the number of jokers available',
        () => {
            const word = 'mOt';
            const lettersUsedOnBoard: { letter: string; coord: Vec2 }[] = [];

            rackServiceSpy.findJokersNumberOnRack.and.returnValue(2);

            // Car validateJokersOccurrencesMatch est privée
            // eslint-disable-next-line dot-notation
            const result = service['validateJokersOccurrencesMatch'](word, lettersUsedOnBoard);
            expect(result.error).toEqual(false);
        },
    );

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
        tiles[coord.y - 1][coord.x].letter = 'a';

        // Car findAdjacentUp est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentUp'](coord);
        expect(result).toBeTrue();
    });

    it(' findAdjacentUp should return false if the letter is place at the extreme top of the board', () => {
        const coord = { y: 0, x: 4 };

        // Car findAdjacentUp est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentUp'](coord);
        expect(result).toBeFalse();
    });

    it(' findAdjacentUp should return false if the letter is not place at the extreme top of the board and there is no letter above', () => {
        const coord = { x: 1, y: 4 };
        tiles[coord.y - 1][coord.x].letter = '';

        // Car findAdjacentUp est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentUp'](coord);
        expect(result).toBeFalse();
    });

    it(' findAdjacentDown should return true', () => {
        const coord = { x: 13, y: 4 };
        tiles[coord.y + 1][coord.x].letter = 'a';

        // Car findAdjacentDown est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentDown'](coord);
        expect(result).toBeTrue();
    });

    it(' findAdjacentDown should return false if the letter is place at the extreme bottom of the board', () => {
        const coord = { y: 14, x: 4 };

        // Car findAdjacentDown est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentDown'](coord);
        expect(result).toBeFalse();
    });

    it(
        ' findAdjacentDown should return false if the letter is not place at the extreme bottom of' +
            ' the board and there is no letter bottom of it',
        () => {
            const coord = { y: 13, x: 4 };
            tiles[coord.y + 1][coord.x].letter = '';

            // Car findAdjacentUp est privée
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentDown'](coord);
            expect(result).toBeFalse();
        },
    );

    it(' findAdjacentRight should return true', () => {
        const coord = { x: 1, y: 13 };
        tiles[coord.y][coord.x + 1].letter = 'a';

        // Car findAdjacentRight est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentRight'](coord);
        expect(result).toBeTrue();
    });

    it(' findAdjacentRight should return false if the letter is place on the extreme right of the board', () => {
        const coord = { y: 0, x: 14 };

        // Car findAdjacentRight est privée
        // eslint-disable-next-line dot-notation
        const result = service['findAdjacentRight'](coord);
        expect(result).toBeFalse();
    });

    it(
        ' findAdjacentRight should return false if the letter is not place at the extreme right' +
            ' of the board and there is no letter on its right',
        () => {
            const coord = { y: 1, x: 13 };
            tiles[coord.y][coord.x + 1].letter = '';

            // Car findAdjacentRight est privée
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentRight'](coord);
            expect(result).toBeFalse();
        },
    );

    it(' findAdjacentLeft should return true', () => {
        const coord = { x: 1, y: 1 };
        tiles[coord.y][coord.x - 1].letter = 'a';

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
            'if there is adjacency and no firstMove error',
        () => {
            const coord = { x: 1, y: 1 };
            const word = 'moto';
            const direction = 'v';
            tiles[7][7].letter = 'A';

            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };

            spyOn(service, 'areCoordValid').and.returnValue(true);
            spyOn(service, 'isFitting').and.returnValue(response);
            spyOn(service, 'isFirstMove').and.returnValue(false);

            // Car validateInvalidSymbols est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validateInvalidSymbolsSpy = spyOn<any>(service, 'validateInvalidSymbols').and.returnValue(response);

            // Car validateJokersOccurrencesMatch est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validateJokersOccurrencesMatchSpy = spyOn<any>(service, 'validateJokersOccurrencesMatch').and.returnValue(response);

            // Car hasAdjacent est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'hasAdjacent').and.returnValue(true);

            service.validatePlaceFeasibility(word, coord, direction);
            expect(validateInvalidSymbolsSpy).toHaveBeenCalled();
            expect(validateJokersOccurrencesMatchSpy).toHaveBeenCalled();
        },
    );

    it(' validatePlaceFeasibility should call validateFirstMove if it is the first move', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';

        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, message: result };

        spyOn(service, 'areCoordValid').and.returnValue(true);
        spyOn(service, 'isFitting').and.returnValue(response);
        spyOn(service, 'isFirstMove').and.returnValue(true);

        // Car validateFirstMove est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validateFirstMoveSpy = spyOn<any>(service, 'validateFirstMove').and.returnValue(response);

        service.validatePlaceFeasibility(word, coord, direction);
        expect(validateFirstMoveSpy).toHaveBeenCalled();
    });

    it(' validatePlaceFeasibility should call hasAdjacent if it is not the first move', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';
        tiles[7][7].letter = 'A';

        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, message: result };

        spyOn(service, 'areCoordValid').and.returnValue(true);
        spyOn(service, 'isFitting').and.returnValue(response);
        spyOn(service, 'isFirstMove').and.returnValue(false);

        // Car validateFirstMove est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const validateFirstMoveSpy = spyOn<any>(service, 'validateFirstMove').and.returnValue(response);

        // Car hasAdjacent est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hasAdjacentSpy = spyOn<any>(service, 'hasAdjacent').and.returnValue(true);

        service.validatePlaceFeasibility(word, coord, direction);
        expect(validateFirstMoveSpy).not.toHaveBeenCalled();
        expect(hasAdjacentSpy).toHaveBeenCalled();
    });

    it(' validatePlaceFeasibility should return an error true if it is not the first move and the word has no adjacent', () => {
        const coord = { x: 1, y: 1 };
        const word = 'moto';
        const direction = 'v';

        const result: IChat = { from: SENDER.computer, body: '' };
        const response = { error: false, message: result };

        spyOn(service, 'areCoordValid').and.returnValue(true);
        spyOn(service, 'isFitting').and.returnValue(response);
        spyOn(service, 'isFirstMove').and.returnValue(false);

        // Car hasAdjacent est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'hasAdjacent').and.returnValue(false);

        const validatePlaceFeasibilityResult = service.validatePlaceFeasibility(word, coord, direction);
        expect(validatePlaceFeasibilityResult.error).toEqual(true);
        expect(validatePlaceFeasibilityResult.message.body).toEqual(
            'Commande impossible à réaliser : Vous devez placer un mot ayant au moins une lettre adjacente aux lettres du plateau de jeu.',
        );
    });

    it(' findHorizontalAdjacentWord should return an empty string if the text at the given coords is a bonus', () => {
        const coord = { x: 1, y: 1 };
        tiles[coord.y][coord.x].text = 'dl';

        // eslint-disable-next-line dot-notation
        const result = service['findHorizontalAdjacentWord'](coord);

        expect(result).toEqual('');
    });

    it(' findHorizontalAdjacentWord should return the right word if coords are on the left', () => {
        const coord = { x: 1, y: 6 };
        tiles[coord.y][coord.x - 1].text = '';
        tiles[coord.y][coord.x].text = 'p';
        tiles[coord.y][coord.x + 1].text = 'u';
        tiles[coord.y][coord.x + 2].text = 'dl';

        // Car findHorizontalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findHorizontalAdjacentWord'](coord);

        const expectedResult = 'pu';

        expect(result).toEqual(expectedResult);
    });

    it(' findHorizontalAdjacentWord should return the right word if coords are in the middle', () => {
        const coord = { y: 1, x: 5 };
        tiles[coord.y][coord.x - 2].text = 'dl';
        tiles[coord.y][coord.x - 1].text = 'p';
        tiles[coord.y][coord.x].text = 'u';
        tiles[coord.y][coord.x + 1].text = 'u';
        tiles[coord.y][coord.x + 2].text = '';

        // Car findHorizontalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findHorizontalAdjacentWord'](coord);

        const expectedResult = 'puu';

        expect(result).toEqual(expectedResult);
    });

    it(' findHorizontalAdjacentWord should return the right word if coords are on the left', () => {
        const coord = { y: 1, x: 5 };
        tiles[coord.y][coord.x - 3].text = '';
        tiles[coord.y][coord.x - 2].text = 'o';
        tiles[coord.y][coord.x - 1].text = 'i';
        tiles[coord.y][coord.x].text = 's';
        tiles[coord.y][coord.x + 1].text = '';

        // Car findHorizontalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findHorizontalAdjacentWord'](coord);

        const expectedResult = 'ois';

        expect(result).toEqual(expectedResult);
    });

    it(' findVerticalAdjacentWord should return an empty string if the text at the given coords is a bonus', () => {
        const coord = { x: 1, y: 1 };
        tiles[coord.y][coord.x].text = 'dl';

        // Car findVerticalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findVerticalAdjacentWord'](coord);

        const expectedResult = '';

        expect(result).toEqual(expectedResult);
    });

    it(' findVerticalAdjacentWord should return the right word if coords are on the top', () => {
        const coord = { x: 1, y: 6 };
        tiles[coord.y - 1][coord.x].text = '';
        tiles[coord.y][coord.x].text = 'p';
        tiles[coord.y + 1][coord.x].text = 'u';
        tiles[coord.y + 2][coord.x].text = 'dl';

        // Car findVerticalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findVerticalAdjacentWord'](coord);

        const expectedResult = 'pu';

        expect(result).toEqual(expectedResult);
    });

    it(' findVerticalAdjacentWord should return the right word if coords are in the middle', () => {
        const coord = { x: 10, y: 5 };
        tiles[coord.y - 2][coord.x].text = 'dl';
        tiles[coord.y - 1][coord.x].text = 'p';
        tiles[coord.y][coord.x].text = 'u';
        tiles[coord.y + 1][coord.x].text = 'u';
        tiles[coord.y + 2][coord.x].text = '';

        // Car findVerticalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findVerticalAdjacentWord'](coord);

        const expectedResult = 'puu';

        expect(result).toEqual(expectedResult);
    });

    it(' findVerticalAdjacentWord should return the right word if coords are on the bottom', () => {
        const coord = { x: 11, y: 5 };
        tiles[coord.y - 3][coord.x].text = '';
        tiles[coord.y - 2][coord.x].text = 'o';
        tiles[coord.y - 1][coord.x].text = 'i';
        tiles[coord.y][coord.x].text = 's';
        tiles[coord.y + 1][coord.x].text = '';

        // Car findVerticalAdjacentWord est privée
        // eslint-disable-next-line dot-notation
        const result = service['findVerticalAdjacentWord'](coord);

        const expectedResult = 'ois';

        expect(result).toEqual(expectedResult);
    });

    it(' computeCoordByDirection should return the same y but the x should be added with step if direction is v', () => {
        const coord = { y: 11, x: 5 };
        const direction = 'v';
        const step = 2;

        const result = service.computeCoordByDirection(direction, coord, step);

        const expectedResult = { x: coord.x, y: coord.y + step };

        expect(result).toEqual(expectedResult);
    });

    it(' computeCoordByDirection should return the same x but the y should be added with step if direction is h', () => {
        const coord = { x: 11, y: 5 };
        const direction = 'h';
        const step = 2;

        const result = service.computeCoordByDirection(direction, coord, step);

        const expectedResult = { x: coord.x + step, y: coord.y };

        expect(result).toEqual(expectedResult);
    });

    it(' checkAllWordsExist should return an error if it is first move and the given word length is less than 2', async () => {
        const coord = { x: 1, y: 1 };
        const word = 'm';

        // Car isFirstMove est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isFirstMove').and.returnValue(true);

        const expectedResult = {
            wordExists: false,
            errorMessage: `il vous faut former des mots d'une longueur minimale de 2, mais le mot ${word} a une longueur de 1.`,
        };

        // Car validateWords est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spy = spyOn<any>(service, 'validateWords');
        spy.and.returnValue(Promise.resolve(expectedResult));

        const result = await service.checkAllWordsExist(word, coord);
        expect(result).toEqual(expectedResult);
    });

    it(
        ' checkAllWordsExist should return an error if findHorizontalAdjacentWord' +
            ' return a word that length is more than 2 and does not exist in the dictionary',
        async () => {
            const coord = { x: 1, y: 1 };
            const word = 'mmm';

            // Car isFirstMove est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isFirstMove').and.returnValue(false);

            // Car findHorizontalAdjacentWord est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findHorizontalAdjacentWord').and.returnValue(word);

            const expectedResult = { wordExists: false, errorMessage: `le mot ${word} n'existe pas dans le dictionnaire` };

            // Car validateWords est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const spy = spyOn<any>(service, 'validateWords');
            spy.and.returnValue(Promise.resolve(expectedResult));
            const result = await service.checkAllWordsExist(word, coord);
            expect(result).toEqual(expectedResult);
        },
    );

    it(
        ' checkAllWordsExist should return an error if findVerticalAdjacentWord' +
            ' return a word that length is less more than 2 and does not exist in the dictionary',
        async () => {
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

            // Car validateWords est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const spy = spyOn<any>(service, 'validateWords');
            spy.and.returnValue(Promise.resolve(expectedResult));

            const result = await service.checkAllWordsExist(word, coord);
            expect(result).toEqual(expectedResult);
        },
    );

    it(' checkAllWordsExist should return true if the words exist', async () => {
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

        // Car validateWords est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spy = spyOn<any>(service, 'validateWords');
        spy.and.returnValue(Promise.resolve(expectedResult));
        const result = await service.checkAllWordsExist(word, coord);
        expect(result).toEqual(expectedResult);
    });

    it(' isFitting should throw an error there is not enough space for the word horizontally', () => {
        const coord = { y: 1, x: 13 };
        const word = 'papa';
        const direction = 'h';

        const result = service.isFitting(coord, direction, word);
        expect(result.error).toEqual(true);
        expect(result.message.body).toEqual("Commande impossible à réaliser : Il n'y a pas assez de place pour écrire ce mot.");
    });

    it(' isFitting should an error true if there is not enough space for the word vertically', () => {
        const coord = { y: 14, x: 1 };
        const word = 'papa';
        const direction = 'v';

        const result = service.isFitting(coord, direction, word);
        expect(result.error).toEqual(true);
        expect(result.message.body).toEqual("Commande impossible à réaliser : Il n'y a pas assez de place pour écrire ce mot.");
    });

    it(' isFitting should return an error true there are letters that are not on the rack nor on the board', () => {
        const coord = { x: 9, y: 1 };
        const word = 'papa';
        const direction = 'v';

        // Car isCaseEmpty est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isCaseEmpty').and.returnValue(true);

        rackServiceSpy.isLetterOnRack.and.returnValue(false);
        const result = service.isFitting(coord, direction, word);
        expect(result.error).toEqual(true);
        expect(result.message.body).toEqual(
            'Commande impossible à réaliser : Il y a des lettres qui ne sont ni sur le plateau de jeu, ni sur le chevalet.',
        );
    });

    it(
        ' isFitting should return an error true' +
            ' if there are letters on the board where we want to place and if there are not the same than ours',
        () => {
            const coord = { x: 9, y: 1 };
            const word = 'papa';
            const direction = 'v';

            // Car isCaseEmpty est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isCaseEmpty').and.returnValue(false);

            // Car isLetterOnBoardTheSame est privée
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isLetterOnBoardTheSame').and.returnValue(false);

            const result = service.isFitting(coord, direction, word);
            expect(result.error).toEqual(true);
            expect(result.message.body).toEqual("Commande impossible à réaliser : Il y a déjà une lettre dans l'une des cases ciblées.");
        },
    );

    it(' isFitting should update the letters that were on the board and that we used in our placement', () => {
        const coord = { y: 9, x: 1 };
        const word = 'papa';
        const direction = 'v';

        // Car isCaseEmpty est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isCaseEmpty').and.returnValue(false);

        // Car isLetterOnBoardTheSame est privée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        spyOn<any>(service, 'isLetterOnBoardTheSame').and.returnValue(true);

        service.isFitting(coord, direction, word);
        const expectedResult = [
            { letter: 'p', coord: { y: 9, x: 1 } },
            { letter: 'a', coord: { y: 10, x: 1 } },
            { letter: 'p', coord: { y: 11, x: 1 } },
            { letter: 'a', coord: { y: 12, x: 1 } },
        ];

        expect(service.lettersUsedOnBoard).toEqual(expectedResult);
    });
});
