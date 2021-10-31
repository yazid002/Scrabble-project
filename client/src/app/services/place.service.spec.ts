import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ImpossibleCommand } from '@app/classes/command-errors/impossible-command/impossible-command';
import { Dictionary } from '@app/classes/dictionary';
import { PLAYER } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { VerifyService } from '@app/services/verify.service';
import { GameService } from './game.service';
import { GridService } from './grid.service';
import { PlaceService } from './place.service';
import { PointsCountingService } from './points-counting.service';
import { RackService } from './rack.service';

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

    beforeEach(() => {
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

        gameServiceSpy = jasmine.createSpyObj('GameService', ['initializePlayers', 'changeTurn']);
        gameServiceSpy.currentTurn = PLAYER.realPlayer;
        gameServiceSpy.players = [
            {
                id: PLAYER.realPlayer,
                name: 'Random name',
                rack: [
                    { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                    { name: 'B', quantity: 2, points: 3, affiche: 'B' },
                    { name: 'C', quantity: 2, points: 3, affiche: 'C' },
                    { name: 'D', quantity: 3, points: 2, affiche: 'D' },
                    { name: 'E', quantity: 15, points: 1, affiche: 'E' },
                ],
                points: 0,
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
        gridServiceSpy = jasmine.createSpyObj('GridService', ['fillGridPortion']);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        gridServiceSpy.gridContext = ctxStub;
        gridServiceSpy.letterStyle = { color: 'NavajoWhite', font: '15px serif' };
        gridServiceSpy.pointStyle = { color: 'NavajoWhite', font: '10px serif' };

        pointsCountingServiceSpy = jasmine.createSpyObj('PointsCountingService', ['processWordPoints']);
        TestBed.configureTestingModule({
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: PointsCountingService, useValue: pointsCountingServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
                { provide: VerifyService, useValue: verifyServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
            ],
        });
        service = TestBed.inject(PlaceService);
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
            const wordExistsParams = { wordExists: true, errorMessage: '' };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            // spyOn(service, 'isLetterOnRack');
            await service.placeWord(wordToCheck, coord, direction);
            expect(verifyServiceSpy.validatePlaceFeasibility).toHaveBeenCalledTimes(1);
        });

        it(' should call verifyServiceSpy.validatePlaceFeasibility', async () => {
            const wordExistsParams = { wordExists: true, errorMessage: '' };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);

            await service.placeWord(wordToCheck, coord, direction);

            expect(verifyServiceSpy.validatePlaceFeasibility).toHaveBeenCalledTimes(1);
        });

        it(' should call writeWord', async () => {
            const wordExistsParams = { wordExists: true, errorMessage: '' };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            const writeWordSpy = spyOn(service, 'writeWord').and.callThrough();

            await service.placeWord(wordToCheck, coord, direction);

            expect(writeWordSpy).toHaveBeenCalledTimes(1);
        });

        it(' should call verifyServiceSpy.checkAllWordsExist', async () => {
            const wordExistsParams = { wordExists: true, errorMessage: '' };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);

            await service.placeWord(wordToCheck, coord, direction);

            expect(verifyServiceSpy.checkAllWordsExist).toHaveBeenCalledTimes(1);
        });

        it(' should throw ImpossibleCommand', async () => {
            const wordExistsParams = { wordExists: false, errorMessage: "Le mot n'est pas valide." };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);

            const result = await service.placeWord(wordToCheck, coord, direction).catch((error) => {
                return error;
            });

            expect(result).toEqual(new ImpossibleCommand("Le mot n'est pas valide."));
        });

        it(' should update the tiles letters', async () => {
            const wordExistsParams = { wordExists: true, errorMessage: '' };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);

            const updateTilesLettersSpy = spyOn(service, 'updateTilesLetters').and.callThrough();

            await service.placeWord(wordToCheck, coord, direction);

            expect(updateTilesLettersSpy).toHaveBeenCalled();
        });

        it(' should update the tiles letters', async () => {
            const wordExistsParams = { wordExists: true, errorMessage: '' };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);

            const updateTilesLettersSpy = spyOn(service, 'updateTilesLetters').and.callThrough();

            await service.placeWord(wordToCheck, coord, direction);

            expect(updateTilesLettersSpy).toHaveBeenCalled();
        });

        it(' should update the tiles letters', fakeAsync(() => {
            const wordExistsParams = { wordExists: false, errorMessage: "Le mot n'est pas valide." };
            const placementDuration = 3000; // 3000 millisecondes soit 3s;
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);

            service.placeWord(wordToCheck, coord, direction).catch((error) => {
                return error;
            });
            tick(placementDuration);
            expect(gridServiceSpy.fillGridPortion).toHaveBeenCalled();
        }));
    });
    describe('placeWordInstant', () => {
        it('should write word if word is valid on placeWordInstant', () => {
            const wordExistsParams = { wordExists: true, errorMessage: '' };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            const writeWordSpy = spyOn(service, 'writeWord').and.callThrough();

            service.placeWordInstant(wordToCheck, coord, direction);

            expect(writeWordSpy).toHaveBeenCalledTimes(1);
        });
        it('should not write word if word is valid on placeWordInstant', () => {
            const wordExistsParams = { wordExists: false, errorMessage: '' };
            verifyServiceSpy.computeCoordByDirection.and.returnValue(coord);
            verifyServiceSpy.normalizeWord.and.returnValue(wordToCheck);
            verifyServiceSpy.checkAllWordsExist.and.returnValue(wordExistsParams);
            const writeWordSpy = spyOn(service, 'writeWord').and.callThrough();

            service.placeWordInstant(wordToCheck, coord, direction);

            expect(writeWordSpy).not.toHaveBeenCalled();
        });
    });
});
