/* eslint-disable max-lines */
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { IChat, SENDER } from '@app/classes/chat';
import { Vec2 } from '@app/classes/vec2';
import { RackService } from '@app/services/rack.service';
import { VerifyService } from '@app/services/verify.service';
import { Observable } from 'rxjs';
import { UserSettingsService } from './user-settings.service';
const getDictUrl = 'http://localhost:3000/api/admin/dictionary/findAll';
describe('VerifyService', () => {
    let service: VerifyService;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let httpTestingController: HttpTestingController;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
    beforeEach(() => {
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries']);
        userSettingsServiceSpy.getDictionaries.and.callFake(() => undefined);
        rackServiceSpy = jasmine.createSpyObj('RackService', ['findJokersNumberOnRack', 'isLetterOnRack']);

        TestBed.configureTestingModule({ providers: [{ provide: RackService, useValue: rackServiceSpy }], imports: [HttpClientTestingModule] });
        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(VerifyService);
    });
    afterEach(() => {
        httpTestingController.verify();
    });

    describe('functiuns that will get dictionaries from server', () => {
        afterEach(() => {
            const getDictReq = httpTestingController.expectOne(getDictUrl);
            expect(getDictReq.request.method).toEqual('GET');
        });
        it(
            ' findAdjacentDown should return false if the letter is not place at the extreme bottom of' +
                ' the board and there is no letter bottom of it',
            () => {
                const coord = { y: 13, x: 4 };
                tiles[coord.y + 1][coord.x].letter = '';

                // findAdjacentUp is private
                // eslint-disable-next-line dot-notation
                const result = service['findAdjacentDown'](coord);
                expect(result).toBeFalse();
            },
        );
        it(
            ' isFitting should return an error true' +
                ' if there are letters on the board where we want to place and if there are not the same than ours',
            () => {
                const coord = { x: 9, y: 1 };
                const word = 'papa';
                const direction = 'v';

                // isCaseEmpty is private
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                spyOn<any>(service, 'isCaseEmpty').and.returnValue(false);

                // isLetterOnBoardTheSame is private
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                spyOn<any>(service, 'isLetterOnBoardTheSame').and.returnValue(false);

                const result = service.isFitting(coord, direction, word);
                expect(result.error).toEqual(true);
                expect(result.message.body).toEqual("Commande impossible à réaliser : Il y a déjà une lettre dans l'une des cases ciblées.");
            },
        );
        it(
            ' findAdjacentRight should return false if the letter is not place at the extreme right' +
                ' of the board and there is no letter on its right',
            () => {
                const coord = { y: 1, x: 13 };
                tiles[coord.y][coord.x + 1].letter = '';

                // findAdjacentRight is private
                // eslint-disable-next-line dot-notation
                const result = service['findAdjacentRight'](coord);
                expect(result).toBeFalse();
            },
        );
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

                // validateInvalidSymbols is private
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const validateInvalidSymbolsSpy = spyOn<any>(service, 'validateInvalidSymbols').and.returnValue(response);

                // validateJokersOccurrencesMatch is private
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const validateJokersOccurrencesMatchSpy = spyOn<any>(service, 'validateJokersOccurrencesMatch').and.returnValue(response);

                // hasAdjacent is private
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                spyOn<any>(service, 'hasAdjacent').and.returnValue(true);

                service.validatePlaceFeasibility(word, coord, direction);
                expect(validateInvalidSymbolsSpy).toHaveBeenCalled();
                expect(validateJokersOccurrencesMatchSpy).toHaveBeenCalled();
            },
        );

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

            // checkInvalidSymbols is private
            // eslint-disable-next-line dot-notation
            const result = service['validateInvalidSymbols'](wordToCheck);
            expect(result.error).toEqual(false);
        });

        it(' validateInvalidSymbols should an error true if the word contains invalid symbols', () => {
            const wordToCheck = 'pa-pa';
            // checkInvalidSymbols is private
            // eslint-disable-next-line dot-notation
            const result = service['validateInvalidSymbols'](wordToCheck);

            expect(result.error).toEqual(true);
        });

        it(' isFirstMove should return true', () => {
            const h8Coord: Vec2 = { x: 7, y: 7 };
            tiles[h8Coord.x][h8Coord.y].letter = '';

            // isFirstMove is private
            // eslint-disable-next-line dot-notation
            const result = service['isFirstMove']();
            expect(result).toBeTrue();
        });

        it(' isFirstMove should return false', () => {
            const h8Coord: Vec2 = { x: 7, y: 7 };
            tiles[h8Coord.x][h8Coord.y].letter = 'A';

            // isFirstMove is private
            // eslint-disable-next-line dot-notation
            const result = service['isFirstMove']();
            expect(result).toBeFalse();
        });

        it(' validateFirstMove should return an error false if the first move is correct', () => {
            const word = 'moto';
            const coord = { x: 7, y: 6 };
            const direction = 'v';

            // validateFirstMove is private
            // eslint-disable-next-line dot-notation
            const result = service['validateFirstMove'](word, direction, coord);
            expect(result.error).toEqual(false);
        });

        it(' validateFirstMove should return an error true if the first move is not correct', () => {
            const word = 'moto';
            const coord = { x: 2, y: 4 };
            const direction = 'v';

            // validateFirstMove is private
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

                // validateJokersOccurrencesMatch is private
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

                // validateJokersOccurrencesMatch is private
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

                // validateJokersOccurrencesMatch is private
                // eslint-disable-next-line dot-notation
                const result = service['validateJokersOccurrencesMatch'](word, lettersUsedOnBoard);
                expect(result.error).toEqual(false);
            },
        );

        it(' isLetterOnBoardTheSame should return true', () => {
            const letterOnBoard = 'A';
            const letterToPlace = 'A';

            // isFirstMove is private
            // eslint-disable-next-line dot-notation
            const result = service['isLetterOnBoardTheSame'](letterOnBoard, letterToPlace);
            expect(result).toBeTrue();
        });

        it(' isLetterOnBoardTheSame should return false', () => {
            const letterOnBoard = 'A';
            const letterToPlace = 'B';

            // isLetterOnBoardTheSame is private
            // eslint-disable-next-line dot-notation
            const result = service['isLetterOnBoardTheSame'](letterOnBoard, letterToPlace);
            expect(result).toBeFalse();
        });

        it(' isCaseEmpty should return false', () => {
            const letterOnBoard = 'A';

            // isCaseEmpty is private
            // eslint-disable-next-line dot-notation
            const result = service['isCaseEmpty'](letterOnBoard);
            expect(result).toBeFalse();
        });

        it(' isCaseEmpty should return true', () => {
            const letterOnBoard = '';

            // isCaseEmpty is private
            // eslint-disable-next-line dot-notation
            const result = service['isCaseEmpty'](letterOnBoard);
            expect(result).toBeTrue();
        });

        it(' findAdjacentUp should return true', () => {
            const coord = { x: 1, y: 4 };
            tiles[coord.y - 1][coord.x].letter = 'a';

            // findAdjacentUp is private
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentUp'](coord);
            expect(result).toBeTrue();
        });

        it(' findAdjacentUp should return false if the letter is place at the extreme top of the board', () => {
            const coord = { y: 0, x: 4 };

            // findAdjacentUp is private
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentUp'](coord);
            expect(result).toBeFalse();
        });

        it(' findAdjacentUp should return false if the letter is not place at the extreme top of the board and there is no letter above', () => {
            const coord = { x: 1, y: 4 };
            tiles[coord.y - 1][coord.x].letter = '';

            // findAdjacentUp is private
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentUp'](coord);
            expect(result).toBeFalse();
        });

        it(' findAdjacentDown should return true', () => {
            const coord = { x: 13, y: 4 };
            tiles[coord.y + 1][coord.x].letter = 'a';

            // findAdjacentDown is private
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentDown'](coord);
            expect(result).toBeTrue();
        });

        it(' findAdjacentDown should return false if the letter is place at the extreme bottom of the board', () => {
            const coord = { y: 14, x: 4 };

            // findAdjacentDown is private
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentDown'](coord);
            expect(result).toBeFalse();
        });

        it(' findAdjacentRight should return true', () => {
            const coord = { x: 1, y: 13 };
            tiles[coord.y][coord.x + 1].letter = 'a';

            // findAdjacentRight is private
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentRight'](coord);
            expect(result).toBeTrue();
        });

        it(' findAdjacentRight should return false if the letter is place on the extreme right of the board', () => {
            const coord = { y: 0, x: 14 };

            // findAdjacentRight is private
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentRight'](coord);
            expect(result).toBeFalse();
        });
        it(' findAdjacentLeft should return true', () => {
            const coord = { x: 1, y: 1 };
            tiles[coord.y][coord.x - 1].letter = 'a';

            // findAdjacentLeft is private
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentLeft'](coord);
            expect(result).toBeTrue();
        });

        it(' findAdjacentLeft should return false if the letter is place on the extreme left of the board', () => {
            const coord = { x: 0, y: 0 };

            // findAdjacentRight is private
            // eslint-disable-next-line dot-notation
            const result = service['findAdjacentLeft'](coord);
            expect(result).toBeFalse();
        });

        it(' hasAdjacent should return true any of the letter was already on the board', () => {
            const coord = { x: 1, y: 1 };
            const word = 'moto';
            const direction = 'v';

            // isCaseEmpty is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isCaseEmpty').and.returnValue(false);

            // hasAdjacent is private
            // eslint-disable-next-line dot-notation
            const result = service['hasAdjacent'](word, coord, direction);
            expect(result).toBeTrue();
        });

        it(' hasAdjacent should return true if any of the letter has a top adjacent', () => {
            const coord = { x: 1, y: 1 };
            const word = 'moto';
            const direction = 'v';

            // findAdjacentUp is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findAdjacentUp').and.returnValue(true);

            // hasAdjacent is private
            // eslint-disable-next-line dot-notation
            const result = service['hasAdjacent'](word, coord, direction);
            expect(result).toBeTrue();
        });

        it(' hasAdjacent should return true if any of the letter has a left adjacent', () => {
            const coord = { x: 1, y: 1 };
            const word = 'moto';
            const direction = 'v';

            // findAdjacentUp is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findAdjacentLeft').and.returnValue(true);

            // hasAdjacent is private
            // eslint-disable-next-line dot-notation
            const result = service['hasAdjacent'](word, coord, direction);
            expect(result).toBeTrue();
        });

        it(' hasAdjacent should return true if any of the letter has a right adjacent', () => {
            const coord = { x: 1, y: 1 };
            const word = 'moto';
            const direction = 'v';

            // findAdjacentRight is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findAdjacentRight').and.returnValue(true);

            // hasAdjacent is private
            // eslint-disable-next-line dot-notation
            const result = service['hasAdjacent'](word, coord, direction);
            expect(result).toBeTrue();
        });

        it(' hasAdjacent should return true if any of the letter has a bottom adjacent', () => {
            const coord = { x: 1, y: 1 };
            const word = 'moto';
            const direction = 'v';

            // findAdjacentRight is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findAdjacentDown').and.returnValue(true);

            // hasAdjacent is private
            // eslint-disable-next-line dot-notation
            const result = service['hasAdjacent'](word, coord, direction);
            expect(result).toBeTrue();
        });

        it(' hasAdjacent should return false if none of the letter was on the board or has adjacent', () => {
            const coord = { x: 1, y: 1 };
            const word = 'moto';
            const direction = 'v';

            // findAdjacentRight is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findAdjacentDown').and.returnValue(false);

            // findAdjacentRight is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findAdjacentRight').and.returnValue(false);

            // findAdjacentRight is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findAdjacentLeft').and.returnValue(false);

            // findAdjacentUp is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'findAdjacentUp').and.returnValue(false);

            // isCaseEmpty is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isCaseEmpty').and.returnValue(true);

            // hasAdjacent is private
            // eslint-disable-next-line dot-notation
            const result = service['hasAdjacent'](word, coord, direction);
            expect(result).toBeFalse();
        });
        it(' validatePlaceFeasibility should call validateFirstMove if it is the first move', () => {
            const coord = { x: 1, y: 1 };
            const word = 'moto';
            const direction = 'v';

            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };

            spyOn(service, 'areCoordValid').and.returnValue(true);
            spyOn(service, 'isFitting').and.returnValue(response);
            spyOn(service, 'isFirstMove').and.returnValue(true);

            // validateFirstMove is private
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

            // validateFirstMove is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validateFirstMoveSpy = spyOn<any>(service, 'validateFirstMove').and.returnValue(response);

            // hasAdjacent is private
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

            // hasAdjacent is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'hasAdjacent').and.returnValue(false);

            const validatePlaceFeasibilityResult = service.validatePlaceFeasibility(word, coord, direction);
            expect(validatePlaceFeasibilityResult.error).toEqual(true);
            expect(validatePlaceFeasibilityResult.message.body).toEqual(
                'Commande impossible à réaliser : Vous devez placer un mot ayant au moins une lettre adjacente aux lettres du plateau de jeu.',
            );
        });

        it(' validatePlaceFeasibility should return an error true if the coords are not valid', () => {
            const coord = { x: 1, y: 15 };
            const word = 'moto';
            const direction = 'v';

            const isFittingSpy = spyOn(service, 'isFitting').and.callThrough();
            const isFirstMoveSpy = spyOn(service, 'isFirstMove').and.callThrough();

            // hasAdjacent is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hasAdjacentSpy = spyOn<any>(service, 'hasAdjacent').and.callThrough();

            const validatePlaceFeasibilityResult = service.validatePlaceFeasibility(word, coord, direction);
            expect(validatePlaceFeasibilityResult.error).toEqual(true);
            expect(validatePlaceFeasibilityResult.message.body).toEqual('Commande impossible à réaliser : Les coordonnées ne sont pas valides');
            expect(isFirstMoveSpy).not.toHaveBeenCalled();
            expect(isFittingSpy).not.toHaveBeenCalled();
            expect(hasAdjacentSpy).not.toHaveBeenCalled();
        });

        it(' validatePlaceFeasibility should return an error true if the word does not fit', () => {
            const coord = { x: 1, y: 14 };
            const word = 'moto';
            const direction = 'v';

            const expectedResult = [
                "Commande impossible à réaliser : Il y a déjà une lettre dans l'une des cases ciblées.",
                "Commande impossible à réaliser : Il n'y a pas assez de place pour écrire ce mot.",
                'Commande impossible à réaliser : Il y a des lettres qui ne sont ni sur le plateau de jeu, ni sur le chevalet.',
            ];
            spyOn(service, 'areCoordValid').and.returnValue(true);
            // const isFittingSpy = spyOn(service, 'isFitting').and.returnValue(response);
            const isFirstMoveSpy = spyOn(service, 'isFirstMove').and.callThrough();

            // hasAdjacent is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hasAdjacentSpy = spyOn<any>(service, 'hasAdjacent').and.returnValue(false);

            const validatePlaceFeasibilityResult = service.validatePlaceFeasibility(word, coord, direction);
            expect(validatePlaceFeasibilityResult.error).toEqual(true);
            expect(expectedResult).toContain(validatePlaceFeasibilityResult.message.body);
            expect(isFirstMoveSpy).not.toHaveBeenCalled();
            expect(hasAdjacentSpy).not.toHaveBeenCalled();
        });

        it(' validatePlaceFeasibility should return an error true if the first move is not valid', () => {
            const coord = { x: 6, y: 7 };
            tiles[coord.y][coord.x + 1].letter = '';
            const word = 'moto';
            const direction = 'v';

            const expectedResult = [
                'Commande impossible à réaliser : Ceci est votre premier tour, au moins une de vos lettres doit être placée sur la case H8.',
            ];

            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };

            spyOn(service, 'areCoordValid').and.returnValue(true);
            spyOn(service, 'isFitting').and.returnValue(response);

            // hasAdjacent is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const hasAdjacentSpy = spyOn<any>(service, 'hasAdjacent').and.callThrough();

            const validatePlaceFeasibilityResult = service.validatePlaceFeasibility(word, coord, direction);
            expect(validatePlaceFeasibilityResult.error).toEqual(true);
            expect(expectedResult).toContain(validatePlaceFeasibilityResult.message.body);
            expect(hasAdjacentSpy).not.toHaveBeenCalled();
        });

        it(' validatePlaceFeasibility should return an error true if the number of jokers is not coherent', () => {
            const coord = { x: 6, y: 7 };
            tiles[coord.y][coord.x + 1].letter = '';
            const word = 'moTo';
            const direction = 'v';

            const expectedResult = [
                "Erreur de syntaxe : Il n'y a pas assez d'occurrences sur le chevalet pour les lettres: " +
                    ' * (lettres blanches) représentant les lettres "T" demandées.',
            ];

            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };

            rackServiceSpy.findJokersNumberOnRack.and.returnValue(0);

            spyOn(service, 'areCoordValid').and.returnValue(true);
            spyOn(service, 'isFitting').and.returnValue(response);
            spyOn(service, 'isFirstMove').and.returnValue(false);

            service.lettersUsedOnBoard = [];

            // hasAdjacent is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'hasAdjacent').and.returnValue(true);

            // validateInvalidSymbols is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const validateInvalidSymbolsSpy = spyOn<any>(service, 'validateInvalidSymbols').and.callThrough();

            const validatePlaceFeasibilityResult = service.validatePlaceFeasibility(word, coord, direction);
            expect(validatePlaceFeasibilityResult.error).toEqual(true);
            expect(expectedResult).toContain(validatePlaceFeasibilityResult.message.body);
            expect(validateInvalidSymbolsSpy).not.toHaveBeenCalled();
        });

        it(' validatePlaceFeasibility should return an error true if the word contains invalid symbols', () => {
            const coord = { x: 6, y: 7 };
            tiles[coord.y][coord.x + 1].letter = '';
            const word = 'mo-To';
            const direction = 'v';

            const expectedResult = ["Erreur de syntaxe : Les symboles (-) et (') sont invalides."];

            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };

            rackServiceSpy.findJokersNumberOnRack.and.returnValue(0);

            spyOn(service, 'areCoordValid').and.returnValue(true);
            spyOn(service, 'isFitting').and.returnValue(response);
            spyOn(service, 'isFirstMove').and.returnValue(false);

            service.lettersUsedOnBoard = [];

            // hasAdjacent is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'hasAdjacent').and.returnValue(true);

            // validateJokersOccurrencesMatch is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'validateJokersOccurrencesMatch').and.returnValue(response);

            const validatePlaceFeasibilityResult = service.validatePlaceFeasibility(word, coord, direction);
            expect(validatePlaceFeasibilityResult.error).toEqual(true);
            expect(expectedResult).toContain(validatePlaceFeasibilityResult.message.body);
        });

        it(' validatePlaceFeasibility should return an error false', () => {
            const coord = { x: 6, y: 7 };
            tiles[coord.y][coord.x + 1].letter = '';
            const word = 'moto';
            const direction = 'v';

            const expectedResult = [''];

            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };

            spyOn(service, 'areCoordValid').and.returnValue(true);
            spyOn(service, 'isFitting').and.returnValue(response);
            spyOn(service, 'isFirstMove').and.returnValue(false);

            // hasAdjacent is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'hasAdjacent').and.returnValue(true);

            // validateInvalidSymbols is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'validateInvalidSymbols').and.returnValue(response);

            // validateJokersOccurrencesMatch is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'validateJokersOccurrencesMatch').and.returnValue(response);

            const validatePlaceFeasibilityResult = service.validatePlaceFeasibility(word, coord, direction);
            expect(validatePlaceFeasibilityResult.error).toEqual(false);
            expect(expectedResult).toContain(validatePlaceFeasibilityResult.message.body);
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

            // findHorizontalAdjacentWord is private
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

            // findHorizontalAdjacentWord is private
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

            // findHorizontalAdjacentWord is private
            // eslint-disable-next-line dot-notation
            const result = service['findHorizontalAdjacentWord'](coord);

            const expectedResult = 'ois';

            expect(result).toEqual(expectedResult);
        });

        it(' findVerticalAdjacentWord should return an empty string if the text at the given coords is a bonus', () => {
            const coord = { x: 1, y: 1 };
            tiles[coord.y][coord.x].text = 'dl';

            // findVerticalAdjacentWord is private
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

            // findVerticalAdjacentWord is private
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

            // findVerticalAdjacentWord is private
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

            // findVerticalAdjacentWord is private
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

            // isFirstMove is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isFirstMove').and.returnValue(true);

            const expectedResult = {
                wordExists: false,
                errorMessage: `il vous faut former des mots d'une longueur minimale de 2, mais le mot ${word} a une longueur de 1.`,
            };

            // validateWords is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const spy = spyOn<any>(service, 'validateWords');
            spy.and.returnValue(Promise.resolve(expectedResult));

            const result = await service.checkAllWordsExist(word, coord);
            expect(result).toEqual(expectedResult);
        });

        it(' checkAllWordsExist should return the promise from validateWords', async () => {
            const coord = { x: 1, y: 1 };
            const word = 'papa';
            const horizontalWord = 'mmm';

            // isFirstMove is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isFirstMove').and.returnValue(false);

            spyOn(service, 'getAllFormedWords').and.returnValue([horizontalWord, word]);

            const expectedResult = { wordExists: false, errorMessage: `le mot ${horizontalWord} n'existe pas dans le dictionnaire` };

            const anObservable: Observable<{ wordExists: boolean; errorMessage: string }> = {
                next: () => void '',
                toPromise: async () => Promise.resolve(expectedResult),
            } as unknown as Observable<{ wordExists: boolean; errorMessage: string }>;
            // validateWords is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'validateWords').and.callFake(() => anObservable);

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

            // isCaseEmpty is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isCaseEmpty').and.returnValue(true);

            rackServiceSpy.isLetterOnRack.and.returnValue(false);
            const result = service.isFitting(coord, direction, word);
            expect(result.error).toEqual(true);
            expect(result.message.body).toEqual(
                'Commande impossible à réaliser : Il y a des lettres qui ne sont ni sur le plateau de jeu, ni sur le chevalet.',
            );
        });
        it(' isFitting should update the letters that were on the board and that we used in our placement', () => {
            const coord = { y: 9, x: 1 };
            const word = 'papa';
            const direction = 'v';

            // isCaseEmpty is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isCaseEmpty').and.returnValue(false);

            // isLetterOnBoardTheSame is private
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

        it(' getLettersUsedOnBoardFromPlacement should return empty array if all tiles are empty', () => {
            const coord = { y: 9, x: 1 };
            const word = 'papa';
            const direction = 'v';

            // isCaseEmpty is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isCaseEmpty').and.returnValue(true);

            spyOn(service, 'areCoordValid').and.returnValue(true);

            // isLetterOnBoardTheSame is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isLetterOnBoardTheSameSpy = spyOn<any>(service, 'isLetterOnBoardTheSame').and.returnValue(false);

            const result = service.getLettersUsedOnBoardFromPlacement(coord, direction, word);
            expect(isLetterOnBoardTheSameSpy).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it(' getLettersUsedOnBoardFromPlacement should return empty array if tiles are not empty but letters are not the same', () => {
            const coord = { y: 9, x: 1 };
            const word = 'papa';
            const direction = 'v';
            tiles[coord.y][coord.x].letter = 'c';
            tiles[coord.y + 1][coord.x].letter = 'i';
            tiles[coord.y + 2][coord.x].letter = 'n';
            tiles[coord.y + 3][coord.x].letter = 'q';

            // isCaseEmpty is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isCaseEmpty').and.callThrough();

            spyOn(service, 'areCoordValid').and.returnValue(true);

            // isLetterOnBoardTheSame is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isLetterOnBoardTheSameSpy = spyOn<any>(service, 'isLetterOnBoardTheSame').and.callThrough();

            const result = service.getLettersUsedOnBoardFromPlacement(coord, direction, word);
            expect(isLetterOnBoardTheSameSpy).toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it(' getLettersUsedOnBoardFromPlacement should return all the letters that would be used on board if the placement is validated', () => {
            const coord = { y: 9, x: 1 };
            const word = 'papa';
            const direction = 'v';
            tiles[coord.y][coord.x].letter = 'c';
            tiles[coord.y + 1][coord.x].letter = 'a';
            tiles[coord.y + 2][coord.x].letter = 'c';
            tiles[coord.y + 3][coord.x].letter = 'a';

            const expectedResult = [
                { letter: 'a', coord: { y: 10, x: 1 } },
                { letter: 'a', coord: { y: 12, x: 1 } },
            ];

            // isCaseEmpty is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isCaseEmpty').and.callThrough();

            spyOn(service, 'areCoordValid').and.returnValue(true);

            // isLetterOnBoardTheSame is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isLetterOnBoardTheSameSpy = spyOn<any>(service, 'isLetterOnBoardTheSame').and.callThrough();

            const result = service.getLettersUsedOnBoardFromPlacement(coord, direction, word);
            expect(isLetterOnBoardTheSameSpy).toHaveBeenCalled();
            expect(result).toEqual(expectedResult);
        });

        it(' getLettersUsedOnBoardFromPlacement should return return empty array if coords are not valid', () => {
            const coord = { y: 15, x: 1 };
            const word = 'papa';
            const direction = 'v';

            // isCaseEmpty is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'isCaseEmpty').and.callThrough();

            spyOn(service, 'areCoordValid').and.returnValue(false);

            // isLetterOnBoardTheSame is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isLetterOnBoardTheSameSpy = spyOn<any>(service, 'isLetterOnBoardTheSame').and.callThrough();

            const result = service.getLettersUsedOnBoardFromPlacement(coord, direction, word);
            expect(isLetterOnBoardTheSameSpy).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });

        it(' getAllFormedWords should return all words newly formed', () => {
            const coordOfAlreadyPlaced = { y: 9, x: 1 };
            tiles[coordOfAlreadyPlaced.y][coordOfAlreadyPlaced.x - 1].letter = '';
            tiles[coordOfAlreadyPlaced.y - 1][coordOfAlreadyPlaced.x].letter = '';
            tiles[coordOfAlreadyPlaced.y][coordOfAlreadyPlaced.x].letter = 'c';
            tiles[coordOfAlreadyPlaced.y + 1][coordOfAlreadyPlaced.x].letter = 'a';
            tiles[coordOfAlreadyPlaced.y + 2][coordOfAlreadyPlaced.x].letter = 'c';
            tiles[coordOfAlreadyPlaced.y + 3][coordOfAlreadyPlaced.x].letter = 'a';

            tiles[coordOfAlreadyPlaced.y][coordOfAlreadyPlaced.x].text = 'c';
            tiles[coordOfAlreadyPlaced.y + 1][coordOfAlreadyPlaced.x].text = 'a';
            tiles[coordOfAlreadyPlaced.y + 2][coordOfAlreadyPlaced.x].text = 'c';
            tiles[coordOfAlreadyPlaced.y + 3][coordOfAlreadyPlaced.x].text = 'a';

            const coord = { y: 13, x: 1 };
            const word = 'samedi';
            tiles[coord.y][coord.x].text = 's';
            tiles[coord.y][coord.x + 1].text = 'a';
            tiles[coord.y][coord.x + 2].text = 'm';
            tiles[coord.y][coord.x + 3].text = 'e';
            tiles[coord.y][coord.x + word.length - 2].text = 'd';
            tiles[coord.y][coord.x + word.length - 1].text = 'i';

            tiles[coord.y][coord.x - 1].letter = '';
            tiles[coord.y][coord.x].letter = '';
            tiles[coord.y][coord.x + 1].letter = '';
            tiles[coord.y][coord.x + 2].letter = '';
            tiles[coord.y][coord.x + 3].letter = '';
            tiles[coord.y][coord.x + word.length - 2].letter = '';
            tiles[coord.y][coord.x + word.length - 1].letter = '';
            tiles[coord.y][coord.x + word.length].letter = '';

            const expectedResult = ['samedi', 'cacas'];
            const result = service.getAllFormedWords(word, coord);
            expect(result).toEqual(expectedResult);
        });

        it(' getAllFormedWords should return all words newly formed bigger than 2', () => {
            const coordOfAlreadyPlaced = { y: 9, x: 1 };
            tiles[coordOfAlreadyPlaced.y][coordOfAlreadyPlaced.x - 1].letter = '';
            tiles[coordOfAlreadyPlaced.y - 1][coordOfAlreadyPlaced.x].letter = '';
            tiles[coordOfAlreadyPlaced.y][coordOfAlreadyPlaced.x].letter = 'c';
            tiles[coordOfAlreadyPlaced.y + 1][coordOfAlreadyPlaced.x].letter = 'a';
            tiles[coordOfAlreadyPlaced.y + 2][coordOfAlreadyPlaced.x].letter = 'c';
            tiles[coordOfAlreadyPlaced.y + 3][coordOfAlreadyPlaced.x].letter = 'a';

            tiles[coordOfAlreadyPlaced.y][coordOfAlreadyPlaced.x].text = 'c';
            tiles[coordOfAlreadyPlaced.y + 1][coordOfAlreadyPlaced.x].text = 'a';
            tiles[coordOfAlreadyPlaced.y + 2][coordOfAlreadyPlaced.x].text = 'c';
            tiles[coordOfAlreadyPlaced.y + 3][coordOfAlreadyPlaced.x].text = 'a';

            const coord = { y: 13, x: 1 };
            const word = 's';
            tiles[coord.y][coord.x].text = 's';
            tiles[coord.y][coord.x - 1].text = '';
            tiles[coord.y][coord.x + word.length].text = '';

            tiles[coord.y][coord.x - 1].letter = '';
            tiles[coord.y][coord.x].letter = '';
            tiles[coord.y][coord.x + word.length].letter = '';

            const expectedResult = ['cacas'];
            const result = service.getAllFormedWords(word, coord);
            expect(result).toEqual(expectedResult);
        });

        describe('validateWords', () => {
            it('should send words to validate to the serveur and receive a response', async () => {
                const wordsToValidate = ['bla', 'maman'];
                const response = { wordExists: false, errorMessage: '' };

                // eslint-disable-next-line dot-notation
                service['validateWords'](wordsToValidate).subscribe((doesWordExists) =>
                    expect(doesWordExists).withContext('should send wordExists as true').toEqual(response),
                );

                // validateWords devrait faire une seule requete pour 'POST' les mots à valider
                const expectedRequestBody = { words: wordsToValidate, dict: 'Mon dictionnaire' };

                const req = httpTestingController.expectOne(service.urlString);
                expect(req.request.method).toEqual('POST');
                expect(req.request.body).toEqual(expectedRequestBody);

                // Le serveur devrait retourner que les mots existent après le 'POST'
                const expectedResponse = new HttpResponse({ body: response });
                req.event(expectedResponse);
            });
        });
    });
});
