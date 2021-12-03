/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { IChat } from '@app/classes/chat';
import { generateAnagrams, setVirtualPlayerDictionary } from '@app/classes/chunk-node';
import { Dictionary } from '@app/classes/dictionary';
import { PLAYER } from '@app/classes/player';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/board-constants';
import { of } from 'rxjs';
// disable because we need a cile that is not in the project scope (we can't use '@app/')
// eslint-disable-next-line no-restricted-imports
import * as dictFile from '../../../../server/app/assets/dictionnary.json';
import { DictionaryService } from './admin/dictionary.service';
import { UserSettingsService } from './user-settings.service';
import { VirtualPlayerService } from './virtual-player.service';
const dictionary = dictFile as Dictionary;
type Direction = 'h' | 'v';
interface WordNCoord {
    word: string;
    coord: Vec2;
    direction: Direction;
    points: number;
}
describe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    let ctxStub: CanvasRenderingContext2D;
    let userSettingsServiceSpy: jasmine.SpyObj<UserSettingsService>;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;
    beforeEach(() => {
        dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['fetchDictionary']);
        dictionaryServiceSpy.fetchDictionary.and.callFake(() => of(dictionary));
        userSettingsServiceSpy = jasmine.createSpyObj('UserSettingsService', ['getDictionaries']);
        userSettingsServiceSpy.getDictionaries.and.callFake(() => undefined);
        TestBed.configureTestingModule({ imports: [HttpClientModule] });
        service = TestBed.inject(VirtualPlayerService);

        const exchangeRackServiceSpy = spyOn<any>(service['exchangeService']['rackService'], 'fillRackPortion');
        ctxStub = CanvasTestHelper.createCanvas(DEFAULT_WIDTH, DEFAULT_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service['exchangeService']['rackService'].rackContext = ctxStub;
        exchangeRackServiceSpy.and.returnValue(undefined);

        const verifyServiceSpy = spyOn<any>(service['verifyService'], 'getLettersUsedOnBoardFromPlacement');
        verifyServiceSpy.and.returnValue([]);
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
            const spy = spyOn(service['chatService'], 'addMessage');
            service['debugExecutionService'].state = false;
            service['addOutputToMessages'](message);
            expect(spy).not.toHaveBeenCalled();

            service['debugExecutionService'].state = true;
            service['addOutputToMessages'](message);
            expect(spy).toHaveBeenCalled();
        });
    });
    describe('displayMessages', () => {
        it('should only add message if Virtual player is in advanced mode', () => {
            const message: IChat = { from: 'someone', body: 'content' };
            const spy = spyOn(service['chatService'], 'addMessage');
            service['computerLevel'] = ' a random string';
            service['displayMessage'](message);
            expect(spy).not.toHaveBeenCalled();

            service['computerLevel'] = 'advanced';
            service['displayMessage'](message);
            expect(spy).toHaveBeenCalled();
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

            const spy = spyOn<any>(service['placeService'], 'placeWordInstant');
            spy.and.returnValue(false);

            let actualValue = await service['tryPossibility'](possibility);
            expect(actualValue).toBe(false);

            spy.and.returnValue(true);

            actualValue = await service['tryPossibility'](possibility);
            expect(actualValue).toBe(true);
        });
    });
    describe('makePossibilities', () => {
        it('should return a list of WordNCoord objects. Coorss of these objects should be x=7 and y =7 if this is the first move', () => {
            const spy = spyOn<any>(service['placeService'], 'placeWordInstant');
            spy.and.returnValue(true);
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

            anagramSpy.and.callFake(() => ['Bon', 'Bonjour', 'jour', 'ou', 'la']);
            possibilities = service['makePossibilities']();
            for (const possibility of possibilities) {
                if (possibility.coord.x !== h8Coord.x || possibility.coord.y !== h8Coord.y) allCentered = false;
            }
            expect(allCentered).toBe(false);
        });
    });
});
