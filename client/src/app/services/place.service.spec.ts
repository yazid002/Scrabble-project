/* eslint-disable max-lines */
import { HttpClientModule } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { IChat, SENDER } from '@app/classes/chat';
import { Dictionary } from '@app/classes/dictionary';
import { Player, PLAYER } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { SelectionType } from '@app/enums/selection-enum';
import { GridService } from '@app/services/grid.service';
import { VerifyService } from '@app/services/verify.service';
import { BehaviorSubject } from 'rxjs';
import { GameService } from './game.service';
import { GoalsManagerService } from './goals-manager.service';
import { PlaceSelectionService } from './place-selection.service';
import { PlaceService } from './place.service';
import { PointsCountingService } from './points-counting.service';
import { RackService } from './rack.service';
import { SelectionManagerService } from './selection-manager.service';
import { SoundManagerService } from './sound-manager.service';
import { TimerService } from './timer.service';

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;

describe('PlaceService', () => {
    let service: PlaceService;
    let verifyServiceSpy: jasmine.SpyObj<VerifyService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let ctxStub: CanvasRenderingContext2D;
    let pointsCountingServiceSpy: jasmine.SpyObj<PointsCountingService>;
    let wordToCheck: string;
    let coord: Vec2;
    let direction: string;
    let gameServiceSpy: GameService;
    let goalsManagerServiceSpy: jasmine.SpyObj<GoalsManagerService>;
    let placeSelectionServiceSpy: jasmine.SpyObj<PlaceSelectionService>;
    let selectionManagerServiceSpy: jasmine.SpyObj<SelectionManagerService>;
    let timerServiceSpy: jasmine.SpyObj<TimerService>;
    let soundManagerServiceSpy: jasmine.SpyObj<SoundManagerService>;

    beforeEach(() => {
        soundManagerServiceSpy = jasmine.createSpyObj('SoundManagerService', ['playNonValidPlacementAudio', 'playPlacementAudio']);
        verifyServiceSpy = jasmine.createSpyObj('VerifyService', [
            'computeCoordByDirection',
            'checkAllWordsExist',
            'validatePlaceFeasibility',
            'normalizeWord',
        ]);
        const dictionary = {
            title: 'dictionnaire test',
            description: 'description de test',
            words: ['aa', 'finir', 'manger', 'rouler'],
        } as Dictionary;
        verifyServiceSpy.dictionary = dictionary;
        verifyServiceSpy.formedWords = [];

        timerServiceSpy = jasmine.createSpyObj('TimerService', ['decrementTime']);
        timerServiceSpy.resetTurnCounter = new BehaviorSubject<boolean | Player>(true);

        gameServiceSpy = jasmine.createSpyObj('GameService', ['initializePlayers', 'changeTurn']);
        gameServiceSpy.currentTurn = PLAYER.realPlayer;
        gameServiceSpy.players = [
            {
                id: PLAYER.realPlayer,
                name: 'Random name',
                rack: [
                    { name: 'A', quantity: 9, points: 1, display: 'A' },
                    { name: 'B', quantity: 2, points: 3, display: 'B' },
                    { name: 'C', quantity: 2, points: 3, display: 'C' },
                    { name: 'D', quantity: 3, points: 2, display: 'D' },
                    { name: 'E', quantity: 15, points: 1, display: 'E' },
                ],
                points: 0,
                turnWithoutSkipAndExchangeCounter: 0,
                placeInTenSecondsGoalCounter: 0,
                wordsMapping: new Map<string, number>(),
                words: [],
            },
        ];

        rackServiceSpy = jasmine.createSpyObj('RackService', [
            'replaceLetter',
            'findLetterPosition',
            'countLetterOccurrences',
            'checkLettersAvailability',
            'findInexistentLettersOnRack',
            'replaceWord',
        ]);

        rackServiceSpy.gameService = gameServiceSpy;
        gridServiceSpy = jasmine.createSpyObj('GridService', ['fillGridPortion', 'writeLetter', 'removeArrow']);

        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridServiceSpy.gridContext = ctxStub;
        gridServiceSpy.letterStyle = { color: 'NavajoWhite', font: '15px serif' };
        gridServiceSpy.pointStyle = { color: 'NavajoWhite', font: '10px serif' };
        gridServiceSpy.border = { squareBorderColor: 'black' };
        pointsCountingServiceSpy = jasmine.createSpyObj('PointsCountingService', ['processWordPoints']);
        goalsManagerServiceSpy = jasmine.createSpyObj('GoalsManagerService', ['applyAllGoalsBonus', 'setWordsFormedNumber']);
        placeSelectionServiceSpy = jasmine.createSpyObj('PlaceSelectionService', ['cancelUniqueSelectionFromRack', 'cancelPlacement']);
        selectionManagerServiceSpy = jasmine.createSpyObj('SelectionManagerService', ['updateSelectionType']);
        TestBed.configureTestingModule({
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: PointsCountingService, useValue: pointsCountingServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
                { provide: VerifyService, useValue: verifyServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: GoalsManagerService, useValue: goalsManagerServiceSpy },
                { provide: PlaceSelectionService, useValue: placeSelectionServiceSpy },
                { provide: SelectionManagerService, useValue: selectionManagerServiceSpy },
                { provide: SoundManagerService, useValue: soundManagerServiceSpy },
            ],
            imports: [HttpClientModule],
        });
        service = TestBed.inject(PlaceService);
        service.tiles = JSON.parse(JSON.stringify(tiles));
        wordToCheck = 'taper';
        coord = { x: 2, y: 4 };
        direction = 'h';
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' updateTilesLetters should call verifyServiceSpy.computeCoordByDirection', () => {
        verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
        service.updateTilesLetters(wordToCheck, coord, direction);
        expect(verifyServiceSpy.computeCoordByDirection).toHaveBeenCalledTimes(wordToCheck.length);
    });

    describe('writeWord', () => {
        it(' should call verifyServiceSpy.computeCoordByDirection', () => {
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);

            service.writeWord(wordToCheck, coord, direction);
            expect(verifyServiceSpy.computeCoordByDirection).toHaveBeenCalledTimes(wordToCheck.length);
        });
    });

    describe('placeWord', () => {
        it(' should call verifyServiceSpy.validatePlaceFeasibility', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);

            // restoreAfterPlacement is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'restoreAfterPlacement').and.returnValue(void '');

            await service.placeWord(wordToCheck, coord, direction, true);
            expect(verifyServiceSpy.validatePlaceFeasibility).toHaveBeenCalledTimes(1);
        });

        it(' should call cancelPlacement, updateSelectionType if it is not called through chat and the placement is not feasible', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: 'une erreur' };
            const response = { error: true, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);
            placeSelectionServiceSpy.cancelPlacement.and.returnValue(void '');
            selectionManagerServiceSpy.updateSelectionType.and.returnValue(void '');

            await service.placeWord(wordToCheck, coord, direction, false).catch((error) => {
                expect(error).toEqual(response);
            });

            expect(placeSelectionServiceSpy.cancelPlacement).toHaveBeenCalledTimes(1);
            expect(selectionManagerServiceSpy.updateSelectionType).toHaveBeenCalledWith(SelectionType.Rack);
        });

        it(' should not call cancelPlacement, updateSelectionType if it is called through chat and the placement is not feasible', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: 'une erreur' };
            const response = { error: true, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);
            placeSelectionServiceSpy.cancelPlacement.and.returnValue(void '');
            selectionManagerServiceSpy.updateSelectionType.and.returnValue(void '');

            await service.placeWord(wordToCheck, coord, direction, true).catch((error) => {
                expect(error).toEqual(response);
            });

            expect(placeSelectionServiceSpy.cancelPlacement).not.toHaveBeenCalled();
            expect(selectionManagerServiceSpy.updateSelectionType).not.toHaveBeenCalled();
        });

        it(' should call verifyServiceSpy.checkAllWordsExist', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);
            // restoreAfterPlacement is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'restoreAfterPlacement').and.returnValue(void '');

            await service.placeWord(wordToCheck, coord, direction, true);

            expect(verifyServiceSpy.checkAllWordsExist).toHaveBeenCalledTimes(1);
        });

        it(' should call verifyServiceSpy.checkAllWordsExist', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);
            // restoreAfterPlacement is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'restoreAfterPlacement').and.returnValue(void '');

            await service.placeWord(wordToCheck, coord, direction, true);

            expect(verifyServiceSpy.checkAllWordsExist).toHaveBeenCalledTimes(1);
        });

        it(' should update the turnWithoutSkipAndExchangeCounter of the player if verifyServiceSpy.checkAllWordsExist is false', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: false, errorMessage: "Le mot n'est pas valide." });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);
            // restoreAfterPlacement is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'restoreAfterPlacement').and.returnValue(void '');

            timerServiceSpy.resetTurnCounter.next(false);

            timerServiceSpy.resetTurnCounter.subscribe((value) => {
                expect(value).toEqual(false);
            });
            const placeResponse = await service
                .placeWord(wordToCheck, coord, direction, true)
                .then((message: { error: boolean; message: IChat }) => {
                    timerServiceSpy.resetTurnCounter.subscribe((value) => {
                        expect(value).toEqual(true);
                    });
                    return message;
                })
                .catch((error: { error: boolean; message: IChat }) => {
                    return error;
                });

            expect(placeResponse.message.body).toEqual("Commande impossible à réaliser : Le mot n'est pas valide.");
        });

        it(' should return ImpossibleCommand', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: false, errorMessage: "Le mot n'est pas valide." });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);

            const placeResponse = await service.placeWord(wordToCheck, coord, direction, true).catch((error: { error: boolean; message: IChat }) => {
                return error;
            });

            expect(placeResponse.message.body).toEqual("Commande impossible à réaliser : Le mot n'est pas valide.");
        });

        it(' should call restoreAfterPlacement', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);
            // restoreAfterPlacement is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const restoreAfterPlacementSpy = spyOn<any>(service, 'restoreAfterPlacement').and.returnValue(void '');

            await service.placeWord(wordToCheck, coord, direction, true);

            expect(restoreAfterPlacementSpy).toHaveBeenCalled();
        });
        it(' should call write word if it is called through chat and placement is feasible', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);
            // restoreAfterPlacement is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'restoreAfterPlacement').and.returnValue(void '');

            // writeWord is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const writeWordSpy = spyOn<any>(service, 'writeWord').and.returnValue(void '');

            await service.placeWord(wordToCheck, coord, direction, true);

            expect(writeWordSpy).toHaveBeenCalled();
        });

        it(' should not call write word if it is not called through chat and placement is feasible', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);
            // restoreAfterPlacement is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            spyOn<any>(service, 'restoreAfterPlacement').and.returnValue(void '');

            // writeWord is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const writeWordSpy = spyOn<any>(service, 'writeWord').and.returnValue(void '');

            await service.placeWord(wordToCheck, coord, direction, false);

            expect(writeWordSpy).not.toHaveBeenCalled();
        });
    });
    describe('placeWordInstant', () => {
        it('should write word if word is valid on placeWordInstant', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);
            const writeWordSpy = spyOn(service, 'writeWord').and.callThrough();

            await service.placeWordInstant(wordToCheck, coord, direction);

            expect(writeWordSpy).toHaveBeenCalledTimes(1);
        });

        it('should return false if the placement is not feasible', async () => {
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: true, message: result };
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);

            const placeResult = await service.placeWordInstant(wordToCheck, coord, direction);

            expect(placeResult).toEqual(false);
        });

        it('should call restore grid and not restore after placement if word does not exist', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: false, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);

            // restoreGrid is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const restoreGridSpy = spyOn<any>(service, 'restoreGrid').and.returnValue(void '');

            // restoreAfterPlacement is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const restoreAfterPlacementSpy = spyOn<any>(service, 'restoreAfterPlacement').and.returnValue(void '');

            await service.placeWordInstant(wordToCheck, coord, direction);

            expect(restoreGridSpy).toHaveBeenCalled();
            expect(restoreAfterPlacementSpy).not.toHaveBeenCalled();
        });

        it('should not call restore grid and call restore after placement if word exists', async () => {
            const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
            const result: IChat = { from: SENDER.computer, body: '' };
            const response = { error: false, message: result };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);

            // restoreGrid is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const restoreGridSpy = spyOn<any>(service, 'restoreGrid').and.returnValue(void '');

            // restoreAfterPlacement is private
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const restoreAfterPlacementSpy = spyOn<any>(service, 'restoreAfterPlacement').and.returnValue(void '');

            await service.placeWordInstant(wordToCheck, coord, direction);

            expect(restoreGridSpy).not.toHaveBeenCalled();
            expect(restoreAfterPlacementSpy).toHaveBeenCalled();
        });
    });

    describe('restoreAfterPlacement', () => {
        it('should call updateTilesLetters, replaceWord if it is instant placement ', () => {
            goalsManagerServiceSpy.applyAllGoalsBonus.and.returnValue(void '');
            const updateTilesLettersSpy = spyOn(service, 'updateTilesLetters').and.returnValue(void '');

            // restoreAfterPlacement is private
            // eslint-disable-next-line dot-notation
            service['restoreAfterPlacement'](wordToCheck, direction, coord, true);

            expect(goalsManagerServiceSpy.applyAllGoalsBonus).not.toHaveBeenCalled();
            expect(updateTilesLettersSpy).toHaveBeenCalled();
            expect(rackServiceSpy.replaceWord).toHaveBeenCalled();
        });
        it('should not call removeArrow, writeWord if it is instant placement ', () => {
            const writeWordSpy = spyOn(service, 'writeWord').and.callThrough();
            goalsManagerServiceSpy.applyAllGoalsBonus.and.returnValue(void '');
            spyOn(service, 'updateTilesLetters').and.returnValue(void '');

            // restoreAfterPlacement is private
            // eslint-disable-next-line dot-notation
            service['restoreAfterPlacement'](wordToCheck, direction, coord, true);

            expect(gridServiceSpy.removeArrow).not.toHaveBeenCalled();
            expect(writeWordSpy).not.toHaveBeenCalled();
        });

        it('should call removeArrow, writeWord if it is not instant placement ', () => {
            const writeWordSpy = spyOn(service, 'writeWord').and.callThrough();
            goalsManagerServiceSpy.applyAllGoalsBonus.and.returnValue(void '');
            spyOn(service, 'updateTilesLetters').and.returnValue(void '');
            placeSelectionServiceSpy.cancelUniqueSelectionFromRack.and.callFake(() => {
                placeSelectionServiceSpy.selectedRackIndexesForPlacement.pop();
            });
            placeSelectionServiceSpy.selectedRackIndexesForPlacement = [1];

            // restoreAfterPlacement is private
            // eslint-disable-next-line dot-notation
            service['restoreAfterPlacement'](wordToCheck, direction, coord, false);

            expect(gridServiceSpy.removeArrow).toHaveBeenCalled();
            expect(writeWordSpy).toHaveBeenCalled();
            expect(placeSelectionServiceSpy.cancelUniqueSelectionFromRack).toHaveBeenCalledTimes(1);
        });

        it('should update the player points ', () => {
            const expectedResult = 2;
            goalsManagerServiceSpy.applyAllGoalsBonus.and.returnValue(void '');
            spyOn(service, 'updateTilesLetters').and.returnValue(void '');
            pointsCountingServiceSpy.processWordPoints.and.returnValue(expectedResult);
            placeSelectionServiceSpy.cancelUniqueSelectionFromRack.and.callFake(() => {
                placeSelectionServiceSpy.selectedRackIndexesForPlacement.pop();
            });
            placeSelectionServiceSpy.selectedRackIndexesForPlacement = [1];

            gameServiceSpy.players[PLAYER.realPlayer].points = 0;

            // restoreAfterPlacement is private
            // eslint-disable-next-line dot-notation
            service['restoreAfterPlacement'](wordToCheck, direction, coord, false);

            expect(gameServiceSpy.players[PLAYER.realPlayer].points).toEqual(expectedResult);
        });

        it('should update the player words', () => {
            const expectedResult = 1;
            goalsManagerServiceSpy.applyAllGoalsBonus.and.returnValue(void '');
            spyOn(service, 'updateTilesLetters').and.returnValue(void '');
            pointsCountingServiceSpy.processWordPoints.and.returnValue(expectedResult);
            verifyServiceSpy.formedWords = [wordToCheck];
            placeSelectionServiceSpy.cancelUniqueSelectionFromRack.and.callFake(() => {
                placeSelectionServiceSpy.selectedRackIndexesForPlacement.pop();
            });
            placeSelectionServiceSpy.selectedRackIndexesForPlacement = [];

            gameServiceSpy.players[PLAYER.realPlayer].wordsMapping = new Map<string, number>();
            // restoreAfterPlacement is private
            // eslint-disable-next-line dot-notation
            service['restoreAfterPlacement'](wordToCheck, direction, coord, false);
            expect(goalsManagerServiceSpy.setWordsFormedNumber).toHaveBeenCalledWith(
                gameServiceSpy.players[PLAYER.realPlayer],
                verifyServiceSpy.formedWords,
            );
        });
    });

    describe('restoreGrid', () => {
        it("should call computeCoordByDirection as many time as the word's length", () => {
            const computedCoord = { x: 6, y: 9 };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(computedCoord);
            gridServiceSpy.fillGridPortion.and.returnValue(void '');

            const word = 'maman';

            // restoreGrid is private
            // eslint-disable-next-line dot-notation
            service['restoreGrid'](wordToCheck, direction, coord, true, true);

            expect(verifyServiceSpy.computeCoordByDirection).toHaveBeenCalledTimes(word.length);
        });
        it("should call computeCoordByDirection as many time as the word's length", () => {
            const computedCoord = { x: 6, y: 9 };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(computedCoord);
            gridServiceSpy.fillGridPortion.and.returnValue(void '');

            const word = 'maman';

            // restoreGrid is private
            // eslint-disable-next-line dot-notation
            service['restoreGrid'](wordToCheck, direction, coord, true, true);

            expect(verifyServiceSpy.computeCoordByDirection).toHaveBeenCalledTimes(word.length);
        });

        it('should not call updateSelectionType if is instant placement', () => {
            const computedCoord = { x: 6, y: 9 };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(computedCoord);
            gridServiceSpy.fillGridPortion.and.returnValue(void '');

            const word = 'maman';

            // restoreGrid is private
            // eslint-disable-next-line dot-notation
            service['restoreGrid'](wordToCheck, direction, coord, true, true);

            expect(selectionManagerServiceSpy.updateSelectionType).not.toHaveBeenCalled();
            expect(gridServiceSpy.fillGridPortion).toHaveBeenCalledTimes(word.length);
        });

        it(' should update the tiles letters if it is not instant', fakeAsync(() => {
            const placementDuration = 3000; // 3000 millisecondes soot 3s;

            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            gridServiceSpy.fillGridPortion.and.returnValue(void '');
            // restoreGrid is private
            // eslint-disable-next-line dot-notation
            service['restoreGrid'](wordToCheck, direction, coord, false, true);
            tick(placementDuration);
            expect(gridServiceSpy.fillGridPortion).toHaveBeenCalledTimes(wordToCheck.length);
            expect(selectionManagerServiceSpy.updateSelectionType).toHaveBeenCalled();
            expect(placeSelectionServiceSpy.cancelPlacement).not.toHaveBeenCalled();
        }));

        it(' should call cancelPlacement if it is not instant and not called from chat', fakeAsync(() => {
            const placementDuration = 3000; // 3000 millisecondes soot 3s;

            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            gridServiceSpy.fillGridPortion.and.returnValue(void '');
            placeSelectionServiceSpy.cancelPlacement.and.returnValue(void '');
            // restoreGrid is private
            // eslint-disable-next-line dot-notation
            service['restoreGrid'](wordToCheck, direction, coord, false, false);
            tick(placementDuration);
            expect(gridServiceSpy.fillGridPortion).not.toHaveBeenCalledTimes(wordToCheck.length);
            expect(selectionManagerServiceSpy.updateSelectionType).toHaveBeenCalled();
            expect(placeSelectionServiceSpy.cancelPlacement).toHaveBeenCalled();
        }));
    });

    // it(' should call writeWord', async () => {
    //     const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
    //     const result: IChat = { from: SENDER.computer, body: '' };
    //     const response = { error: false, message: result };
    //     verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
    //     verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
    //     verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
    //     verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);
    //     const writeWordSpy = spyOn(service, 'writeWord').and.callThrough();

    //     await service.placeWord(wordToCheck, coord, direction, true);

    //     expect(writeWordSpy).toHaveBeenCalledTimes(2);
    // });

    // it(' should update the tiles letters', async () => {
    //     const wordExistsParams = Promise.resolve({ wordExists: true, errorMessage: '' });
    //     const result: IChat = { from: SENDER.computer, body: '' };
    //     const response = { error: false, message: result };
    //     verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
    //     verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
    //     verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
    //     verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);

    //     const updateTilesLettersSpy = spyOn(service, 'updateTilesLetters').and.callThrough();

    //     await service.placeWord(wordToCheck, coord, direction, true);

    //     expect(updateTilesLettersSpy).toHaveBeenCalled();
    // });

    // it(' should update the tiles letters', fakeAsync(() => {
    //     const wordExistsParams = Promise.resolve({ wordExists: false, errorMessage: "Le mot n'est pas valide." });
    //     const placementDuration = 3000; // 3000 millisecondes soot 3s;
    //     const result: IChat = { from: SENDER.computer, body: '' };
    //     const response = { error: false, message: result };
    //     verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
    //     verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
    //     verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
    //     verifyServiceSpy.validatePlaceFeasibility.and.returnValue(response);

    //     service.placeWord(wordToCheck, coord, direction, true).catch((error) => {
    //         return error;
    //     });
    //     tick(placementDuration);
    //     expect(gridServiceSpy.fillGridPortion).toHaveBeenCalled();
    // }));
});
