import { TestBed } from '@angular/core/testing';
import { tiles } from '@app/classes/board';
import { IChat } from '@app/classes/chat';
import { Vec2 } from '@app/classes/vec2';
import { PlaceService } from './place.service';
import { VirtualPlayerService } from './virtual-player.service';
type Direction = 'h' | 'v';
interface WordNCoord {
    word: string;
    coord: Vec2;
    direction: Direction;
    points: number;
}
fdescribe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;
    let placeServiceSpy: jasmine.SpyObj<PlaceService>;
    beforeEach(() => {
        placeServiceSpy = jasmine.createSpyObj('PlaceService', ['placeWordInstant']);
        TestBed.configureTestingModule({
            providers: [{ provide: PlaceService, useValue: placeServiceSpy }],
        });
        service = TestBed.inject(VirtualPlayerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('reactToSignal', () => {
        it('should call play if and only if numplayer = solo', () => {
            let numPlayers = 'randomString';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const playSpy = spyOn<any>(service, 'play');
            // eslint-disable-next-line dot-notation
            service['reactToSignal'](numPlayers);
            expect(playSpy).not.toHaveBeenCalled();

            numPlayers = 'solo';
            // eslint-disable-next-line dot-notation
            service['reactToSignal'](numPlayers);
            expect(playSpy).toHaveBeenCalled();
        });
    });
    describe('initialize', () => {
        it('should only run if "alreadyInitialized if false', () => {
            const initialValue = 'a random string';
            // eslint-disable-next-line dot-notation
            service['alreadyInitialized'] = false;
            service.computerLevel = initialValue;
            service.initialize();

            const expectedComputerLevel = 'beginner';
            expect(service.computerLevel).toBe(expectedComputerLevel);

            // eslint-disable-next-line dot-notation
            service['alreadyInitialized'] = true;
            service.computerLevel = initialValue;
            service.initialize();
            expect(service.computerLevel).toBe(initialValue);
        });
    });
    describe('addOutputToMessages', () => {
        it('should add message to the chatService message array if debug state is active', () => {
            const message: IChat = { from: 'someone', body: 'content' };
            // eslint-disable-next-line dot-notation
            const spy = spyOn(service['chatService'], 'addMessage');
            // eslint-disable-next-line dot-notation
            service['debugExecutionService'].state = false;
            // eslint-disable-next-line dot-notation
            service['addOutputToMessages'](message);
            expect(spy).not.toHaveBeenCalled();

            // eslint-disable-next-line dot-notation
            service['debugExecutionService'].state = true;
            // eslint-disable-next-line dot-notation
            service['addOutputToMessages'](message);
            expect(spy).toHaveBeenCalled();
        });
    });
    describe('displayMessages', () => {
        it('should only add message if Virtual player is in advanced mode', () => {
            const message: IChat = { from: 'someone', body: 'content' };
            // eslint-disable-next-line dot-notation
            const spy = spyOn(service['chatService'], 'addMessage');
            // eslint-disable-next-line dot-notation
            service['computerLevel'] = ' a random string';
            // eslint-disable-next-line dot-notation
            service['displayMessage'](message);
            expect(spy).not.toHaveBeenCalled();

            // eslint-disable-next-line dot-notation
            service['computerLevel'] = 'advanced';
            // eslint-disable-next-line dot-notation
            service['displayMessage'](message);
            expect(spy).toHaveBeenCalled();
        });
    });
    describe('sortPossibilitiesAdvanced', () => {
        it('should return an sorted array', () => {
            const wordList: WordNCoord[] = [];
            const listSize = 50;
            const maxPoint = 150;
            for (let i = 0; i < listSize; i++) {
                const exampleWord: WordNCoord = { word: 'word', coord: { x: 7, y: 7 }, direction: 'h', points: Math.floor(maxPoint * Math.random()) };
                wordList.push(exampleWord);
            }

            // eslint-disable-next-line dot-notation
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
    describe('advancedMode', () => {
        beforeEach(() => {
            service.computerLevel = 'advanced';
        });
        describe('play', () => {
            it('should call play function', () => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const spy = spyOn<any>(service, 'place');
                // eslint-disable-next-line dot-notation
                service['play']();
                expect(spy).toHaveBeenCalled();
            });
        });
    });
    describe('place', () => {
        it('should return an IChat object', () => {
            // eslint-disable-next-line dot-notation
            const message: IChat = service['place']();
            expect(message).toBeDefined();
        });
    });
    describe('exchange', () => {
        it('should return an IChat object', () => {
            // eslint-disable-next-line dot-notation
            const message: IChat = service['exchange']();
            expect(message).toBeDefined();
        });
    });

    describe('tryPossibility', () => {
        it('should return true only if placeservice says the possibility is valid', () => {
            const possibility: WordNCoord = { word: 'kjdv', coord: { x: 4, y: 1000 }, direction: 'h', points: 100 };

            placeServiceSpy.placeWordInstant.and.returnValue(false);
            // eslint-disable-next-line dot-notation
            let actualValue = service['tryPossibility'](possibility);
            expect(actualValue).toBe(false);

            placeServiceSpy.placeWordInstant.and.returnValue(true);
            // eslint-disable-next-line dot-notation
            actualValue = service['tryPossibility'](possibility);
            expect(actualValue).toBe(true);
        });
    });
    describe('makePossibilities', () => {
        it('should return a list of WordNCoord objects. Coorss of these objects should be x=7 and y =7 if this is the first move', () => {
            placeServiceSpy.placeWordInstant.and.returnValue(true);
            const h8Coord: Vec2 = { x: 7, y: 7 };
            tiles[h8Coord.x][h8Coord.y].letter = ''; // verifyService checks if isFirstMove by looking if center tile is empty

            // eslint-disable-next-line dot-notation
            let possibilities = service['makePossibilities']();
            let allCentered = true;
            for (const possibility of possibilities) {
                if (possibility.coord.x !== h8Coord.x || possibility.coord.y !== h8Coord.y) allCentered = false;
            }
            expect(allCentered).toBe(true);



            tiles[h8Coord.x][h8Coord.y].letter = 'a';

            // eslint-disable-next-line dot-notation
            possibilities = service['makePossibilities']();
            for (const possibility of possibilities) {
                if (possibility.coord.x !== h8Coord.x || possibility.coord.y !== h8Coord.y) allCentered = false;
            }
            expect(allCentered).toBe(false);
        });
    });
});
