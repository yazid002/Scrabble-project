/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { IChat } from '@app/classes/chat';
import { generateAnagrams, setVirtualPlayerDictionary } from '@app/classes/chunk-node';
import { Dictionary } from '@app/classes/dictionary';
import { IOptionList, NAME_OPTION } from '@app/classes/game-options';
import { Player, PLAYER } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { BehaviorSubject, of } from 'rxjs';
import { DictionaryService } from './admin/dictionary.service';
import { ChatService } from './chat.service';
import { DebugExecutionService } from './command-execution/debug-execution.service';
import { ExchangeService } from './exchange.service';
import { GameService } from './game.service';
import { GoalsManagerService } from './goals-manager.service';
import { PlaceService } from './place.service';
import { PointsCountingService } from './points-counting.service';
import { TimerService } from './timer.service';
import { UserSettingsService } from './user-settings.service';
import { VerifyService } from './verify.service';
import { VirtualPlayerService } from './virtual-player.service';
const dictionary: Dictionary = {
    title: 'first dictionary',
    description: 'the first dictionary for test purpose',
    words: ['Bon', 'Bonjour', 'jour', 'ou', 'la'],
};
type Direction = 'h' | 'v';
interface WordNCoord {
    word: string;
    coord: Vec2;
    direction: Direction;
    points: number;
}

const MODE: IOptionList = {
    settingName: 'Mode de jeux',
    availableChoices: [
        { key: 'classic', value: 'Classique' },
        { key: 'log2990', value: 'LOG2990', disabled: true },
    ],
};
const NUM_PLAYERS: IOptionList = {
    settingName: 'Nombre de joueurs',
    availableChoices: [
        { key: 'solo', value: 'Solo' },
        { key: 'multiplayer', value: 'Multijoueurs', disabled: false },
    ],
};
const COMPUTER_LEVEL: IOptionList = {
    settingName: "Niveau de l'ordinateur",
    availableChoices: [{ key: 'beginner', value: 'Débutant' }],
};

const TIMER: IOptionList = {
    settingName: 'Temps maximal par tour',
    availableChoices: [
        { key: '30', value: '30s' },
        { key: '60', value: '1m' },
        { key: '90', value: '1m30s' },
        { key: '120', value: '2m' },
    ],
};
describe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;
    let exchangeServiceSpy: jasmine.SpyObj<ExchangeService>;
    let goalsManagerServiceSpy: jasmine.SpyObj<GoalsManagerService>;
    let gameServiceSpy: jasmine.SpyObj<GameService>;
    let chatServiceSpy: jasmine.SpyObj<ChatService>;
    let timerServiceSpy: jasmine.SpyObj<TimerService>;
    let debugExecutionServiceSpy: jasmine.SpyObj<DebugExecutionService>;
    let pointsCountingServiceSpy: jasmine.SpyObj<PointsCountingService>;
    let verifyServiceSpy: jasmine.SpyObj<VerifyService>;
    let placeServiceSpy: jasmine.SpyObj<PlaceService>;
    beforeEach(() => {
        placeServiceSpy = jasmine.createSpyObj('PlaceService', ['placeWordInstant']);
        verifyServiceSpy = jasmine.createSpyObj('VerifyService', ['getLettersUsedOnBoardFromPlacement', 'isFirstMove']);
        dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['fetchDictionary', 'getAllDictionaries']);
        dictionaryServiceSpy.fetchDictionary.and.callFake(() => of(dictionary));
        dictionaryServiceSpy.getAllDictionaries.and.returnValue(Promise.resolve([{ title: dictionary.title, description: dictionary.description }]));
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries']);
        userSettingsServiceSpy.getDictionaries.and.callFake(() => undefined);
        userSettingsServiceSpy.settings = {
            mode: { setting: MODE, currentChoiceKey: 'classic' },
            numPlayers: { setting: NUM_PLAYERS, currentChoiceKey: 'solo' },
            computerLevel: { setting: COMPUTER_LEVEL, currentChoiceKey: 'beginner' },
            timer: { setting: TIMER, currentChoiceKey: '60' },
        };
        userSettingsServiceSpy.dictionnaires = [{ title: 'Espagnol', description: 'Langue espagnole' }];
        userSettingsServiceSpy.nameOption = NAME_OPTION;

        userSettingsServiceSpy.computerName = '';
        userSettingsServiceSpy.selectedDictionary = { title: 'Mon Dictionnaire', description: 'a description' };

        debugExecutionServiceSpy = jasmine.createSpyObj('DebugExecutionService', ['resetTimer']);
        debugExecutionServiceSpy.state = false;

        timerServiceSpy = jasmine.createSpyObj('TimerService', ['resetTimer', 'resetTimerDelay']);
        timerServiceSpy.resetTurnCounter = new BehaviorSubject<boolean | Player>(true);

        pointsCountingServiceSpy = jasmine.createSpyObj('PointsCountingService', ['processWordPoints']);
        goalsManagerServiceSpy = jasmine.createSpyObj('GoalsManagerService', ['applyAllGoalsBonus', 'setWordsFormedNumber']);
        goalsManagerServiceSpy.updateGoalProgress = new BehaviorSubject<boolean>(false);
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
            {
                id: PLAYER.otherPlayer,
                name: 'Other random name',
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
        gameServiceSpy.otherPlayerSignal = new BehaviorSubject<string>('a player');
        gameServiceSpy.abandonSignal = new BehaviorSubject<string>('test');
        exchangeServiceSpy = jasmine.createSpyObj('ExchangeService', ['exchangeLetters']);
        chatServiceSpy = jasmine.createSpyObj('ChatService', ['addMessage', 'getMessages']);
        chatServiceSpy.messageSent = new BehaviorSubject<string>('a message');
        chatServiceSpy.messages = [];
        goalsManagerServiceSpy = jasmine.createSpyObj('GoalsManagerService', ['applyAllGoalsBonus']);
        goalsManagerServiceSpy.updateGoalProgress = new BehaviorSubject<boolean>(false);
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                { provide: PlaceService, useValue: placeServiceSpy },
                { provide: PointsCountingService, useValue: pointsCountingServiceSpy },
                { provide: VerifyService, useValue: verifyServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: GoalsManagerService, useValue: goalsManagerServiceSpy },
                { provide: TimerService, useValue: timerServiceSpy },
                { provide: ChatService, useValue: chatServiceSpy },
                { provide: ExchangeService, useValue: exchangeServiceSpy },
                { provide: UserSettingsService, useValue: userSettingsServiceSpy },
                { provide: DictionaryService, useValue: dictionaryServiceSpy },
                { provide: DebugExecutionService, useValue: debugExecutionServiceSpy },
            ],
        });
        service = TestBed.inject(VirtualPlayerService);

        verifyServiceSpy.getLettersUsedOnBoardFromPlacement.and.returnValue([]);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('reactToSignal', () => {
        it('should call play if and only if numplayer = solo', () => {
            let numPlayers = 'randomString';
            const playSpy = spyOn<any>(service, 'play');
            service['reactToSignal'](numPlayers);
            expect(playSpy).not.toHaveBeenCalled();

            numPlayers = 'solo';
            service['reactToSignal'](numPlayers);
            expect(playSpy).toHaveBeenCalled();
        });
    });
    describe('initialize', () => {
        it('should only run if "alreadyInitialized if false', () => {
            const initialValue = 'a random string';
            service['alreadyInitialized'] = false;
            service.computerLevel = initialValue;
            service.initialize();

            const expectedComputerLevel = 'beginner';
            expect(service.computerLevel).toBe(expectedComputerLevel);

            service['alreadyInitialized'] = true;
            service.computerLevel = initialValue;
            service.initialize();
            expect(service.computerLevel).toBe(initialValue);
        });
    });
    describe('addOutputToMessages', () => {
        it('should add message to the chatService message array if debug state is active', () => {
            const message: IChat = { from: 'someone', body: 'content' };
            service['debugExecutionService'].state = false;
            service['addOutputToMessages'](message);
            expect(chatServiceSpy.addMessage).not.toHaveBeenCalled();

            service['debugExecutionService'].state = true;
            service['addOutputToMessages'](message);
            expect(chatServiceSpy.addMessage).toHaveBeenCalled();
        });
    });
    describe('displayMessages', () => {
        it('should only add message if Virtual player is in advanced mode', () => {
            const message: IChat = { from: 'someone', body: 'content' };
            service['computerLevel'] = ' a random string';
            service['displayMessage'](message);
            expect(chatServiceSpy.addMessage).not.toHaveBeenCalled();

            service['computerLevel'] = 'advanced';
            service['displayMessage'](message);
            expect(chatServiceSpy.addMessage).toHaveBeenCalled();
        });
    });

    describe('advancedMode', () => {
        beforeEach(() => {
            service.computerLevel = 'advanced';
        });
        describe('play', () => {
            it('should call play function', () => {
                const spy = spyOn<any>(service, 'place');
                service['play']();
                expect(spy).toHaveBeenCalled();
            });
        });
        describe('sortPossibilitiesAdvanced', () => {
            it('should return an sorted array', () => {
                const wordList: WordNCoord[] = [];
                const listSize = 50;
                const maxPoint = 150;
                for (let i = 0; i < listSize; i++) {
                    const exampleWord: WordNCoord = {
                        word: 'word',
                        coord: { x: 7, y: 7 },
                        direction: 'h',
                        points: Math.floor(maxPoint * Math.random()),
                    };
                    wordList.push(exampleWord);
                }

                const sortedList = service['sortPossibilitiesAdvanced'](wordList);
                let pastPoint = 151;
                let isWellSorted = true;
                for (const item of sortedList) {
                    if (pastPoint < item.points) isWellSorted = false;
                    pastPoint = item.points;
                }
                expect(isWellSorted).toBe(true);
            });
        });
    });
    describe('beginnerMode', () => {
        beforeEach(() => {
            service['computerLevel'] = 'beginner';
        });

        describe('play', () => {
            it('should call place 80% of the timer, exchange 10% and skip 10% of the time', () => {
                const beginnerPlaySpy = spyOn<any>(service, 'beginnerPlay').and.returnValue(void '');
                const advancedPlaySpy = spyOn<any>(service, 'advancedPlay').and.returnValue(void '');

                service['play']();
                expect(beginnerPlaySpy).toHaveBeenCalledWith(service);
                expect(advancedPlaySpy).not.toHaveBeenCalled();
            });
        });
        describe('beginnerPlay', () => {
            it('should call place 80% of the timer, exchange 10% and skip 10% of the time', () => {
                const returnResponse: IChat = { from: 'someone', body: ' aresponse' };
                let placeCounter = 0;
                let exchangeCounter = 0;
                let skipCounter = 0;

                const placeSpy = spyOn<any>(service, 'place');
                placeSpy.and.callFake(() => {
                    placeCounter++;
                    return returnResponse;
                });

                const exchangeSpy = spyOn<any>(service, 'exchange');
                exchangeSpy.and.callFake(() => {
                    exchangeCounter++;
                    return returnResponse;
                });

                const skipSpy = spyOn<any>(service, 'sendSkipMessage');
                skipSpy.and.callFake(() => {
                    skipCounter++;
                });

                const amountOfCalls = 10000;
                for (let i = 0; i < amountOfCalls; i++) {
                    service['beginnerPlay'](service);
                }

                const placeMinCalls = 0.7;
                const placeMaxCalls = 0.9;
                const exchangeMinCalls = 0.05;
                const exchangeMaxCalls = 0.15;
                const skipMinCalls = 0.05;
                const skipMaxCalls = 0.15;

                expect(placeCounter).toBeGreaterThanOrEqual(placeMinCalls * amountOfCalls);
                expect(placeCounter).toBeLessThanOrEqual(placeMaxCalls * amountOfCalls);

                expect(exchangeCounter).toBeGreaterThanOrEqual(exchangeMinCalls * amountOfCalls);
                expect(exchangeCounter).toBeLessThanOrEqual(exchangeMaxCalls * amountOfCalls);
                expect(skipCounter).toBeGreaterThanOrEqual(skipMinCalls * amountOfCalls);
                expect(skipCounter).toBeLessThanOrEqual(skipMaxCalls * amountOfCalls);
            });
        });
    });
    describe('place', () => {
        it('should return an IChat object', async () => {
            const message: IChat = await service['place']();
            expect(message).toBeDefined();
        });
    });
    describe('exchange', () => {
        it('should return an IChat object', () => {
            const message: IChat = service['exchange']();
            expect(message).toBeDefined();
        });
    });

    describe('tryPossibility', () => {
        it('should return true only if placeservice says the possibility is valid', async () => {
            const possibility: WordNCoord = { word: 'kjdv', coord: { x: 4, y: 1000 }, direction: 'h', points: 100 };

            placeServiceSpy.placeWordInstant.and.returnValue(Promise.resolve(false));

            let actualValue = await service['tryPossibility'](possibility);
            expect(actualValue).toBe(false);

            placeServiceSpy.placeWordInstant.and.returnValue(Promise.resolve(true));

            actualValue = await service['tryPossibility'](possibility);
            expect(actualValue).toBe(true);
        });
    });
    describe('makePossibilities', () => {
        it('should return a list of WordNCoord objects. Coorss of these objects should be x=7 and y =7 if this is the first move', () => {
            placeServiceSpy.placeWordInstant.and.returnValue(Promise.resolve(true));
            const h8Coord: Vec2 = { x: 7, y: 7 };
            const container: { gen: (rack: string[], pattern: string) => string[] } = {
                gen: generateAnagrams,
            };
            const anagramSpy = spyOn(container, 'gen');
            anagramSpy.and.callFake(() => ['Bon', 'Bonjour', 'jour', 'ou']);

            service['gameService'].players[PLAYER.otherPlayer].rack = [
                { name: 'B', quantity: 9, points: 1, display: 'B' },
                { name: 'O', quantity: 2, points: 3, display: 'O' },
                { name: 'N', quantity: 2, points: 3, display: 'N' },
                { name: 'J', quantity: 3, points: 2, display: 'J' },
                { name: 'O', quantity: 15, points: 1, display: 'O' },
                { name: 'U', quantity: 15, points: 1, display: 'U' },
                { name: 'R', quantity: 15, points: 1, display: 'R' },
            ];
            tiles[h8Coord.x][h8Coord.y].letter = ''; // verifyService checks if isFirstMove by looking if center tile is empty
            verifyServiceSpy.isFirstMove.and.returnValue(true);
            setVirtualPlayerDictionary(dictionary);
            let possibilities = service['makePossibilities']();
            let allCentered = true;
            for (const possibility of possibilities) {
                if (possibility.coord.x !== h8Coord.x || possibility.coord.y !== h8Coord.y) allCentered = false;
            }

            expect(allCentered).toBe(true);

            tiles[h8Coord.x][h8Coord.y].letter = 'a';
            tiles[h8Coord.x + 1][h8Coord.y].letter = 'l';
            tiles[h8Coord.x + 2][h8Coord.y].letter = 'l';
            tiles[h8Coord.x + 3][h8Coord.y].letter = 'o';
            tiles[h8Coord.x][h8Coord.y + 1].letter = 'a';

            verifyServiceSpy.isFirstMove.and.returnValue(false);

            anagramSpy.and.callFake(() => ['Bon', 'Bonjour', 'jour', 'ou', 'la']);
            possibilities = service['makePossibilities']();
            for (const possibility of possibilities) {
                if (possibility.coord.x !== h8Coord.x || possibility.coord.y !== h8Coord.y) allCentered = false;
            }
            expect(allCentered).toBe(false);
        });
    });

    describe('sendSkipMessage', () => {
        it('should reset turnCounter and display a message', async () => {
            const displayMessageSpy = spyOn<any>(service, 'displayMessage').and.returnValue(void '');

            service['sendSkipMessage']();

            timerServiceSpy.resetTurnCounter.subscribe((result) => {
                expect(result).toEqual(gameServiceSpy.players[PLAYER.otherPlayer]);
            });

            expect(displayMessageSpy).toHaveBeenCalled();
        });
    });

    describe('sendPlacementMessage', () => {
        it('should apply goal bonuses and update the progress and display message', async () => {
            const combination: WordNCoord = { word: 'allo', coord: { x: 5, y: 5 }, direction: 'h', points: 23 };
            const displayMessageSpy = spyOn<any>(service, 'displayMessage').and.returnValue(void '');
            goalsManagerServiceSpy.applyAllGoalsBonus.and.returnValue(void '');

            service['sendPlacementMessage'](combination);

            goalsManagerServiceSpy.updateGoalProgress.subscribe((result) => {
                expect(result).toEqual(true);
            });

            expect(displayMessageSpy).toHaveBeenCalled();
            expect(goalsManagerServiceSpy.applyAllGoalsBonus).toHaveBeenCalled();
        });
    });

    describe('place', () => {
        it('should reset the turnCounter and update the goal progress if no placement is done', async () => {
            const combination: WordNCoord = { word: 'allo', coord: { x: 5, y: 5 }, direction: 'h', points: 0 };
            const displayMessageSpy = spyOn<any>(service, 'displayMessage').and.returnValue(void '');
            goalsManagerServiceSpy.applyAllGoalsBonus.and.returnValue(void '');

            spyOn<any>(service, 'sortPossibilitiesBeginner').and.returnValue([combination]);
            spyOn<any>(service, 'sortPossibilitiesAdvanced').and.returnValue([combination]);
            spyOn<any>(service, 'makePossibilities').and.returnValue([combination]);
            spyOn<any>(service, 'tryPossibility').and.returnValue(Promise.resolve(false));

            await service['place']();

            timerServiceSpy.resetTurnCounter.subscribe((result) => {
                expect(result).toEqual(gameServiceSpy.players[PLAYER.otherPlayer]);
            });

            goalsManagerServiceSpy.updateGoalProgress.subscribe((result) => {
                expect(result).toEqual(true);
            });

            expect(displayMessageSpy).toHaveBeenCalled();
        });

        it('should send stop after finding 3 valid placements', async () => {
            const combinations: WordNCoord[] = [
                { word: 'allo', coord: { x: 5, y: 5 }, direction: 'h', points: 4 },
                { word: 'ba', coord: { x: 5, y: 5 }, direction: 'h', points: 4 },
                { word: 'aa', coord: { x: 5, y: 5 }, direction: 'h', points: 2 },
                { word: 'bc', coord: { x: 5, y: 5 }, direction: 'h', points: 6 },
            ];
            const sendPlacementMessageSpy = spyOn<any>(service, 'sendPlacementMessage').and.returnValue(void '');
            goalsManagerServiceSpy.applyAllGoalsBonus.and.returnValue(void '');

            spyOn<any>(service, 'sortPossibilitiesBeginner').and.returnValue(combinations);
            spyOn<any>(service, 'sortPossibilitiesAdvanced').and.returnValue(combinations);
            spyOn<any>(service, 'makePossibilities').and.returnValue(combinations);
            spyOn<any>(service, 'tryPossibility').and.returnValues(
                Promise.resolve(true),
                Promise.resolve(true),
                Promise.resolve(true),
                Promise.resolve(false),
            );

            await service['place']();

            timerServiceSpy.resetTurnCounter.subscribe((result) => {
                expect(result).not.toEqual(gameServiceSpy.players[PLAYER.otherPlayer]);
            });

            goalsManagerServiceSpy.updateGoalProgress.subscribe((result) => {
                expect(result).not.toEqual(true);
            });

            expect(sendPlacementMessageSpy).toHaveBeenCalled();
        });
    });
});
