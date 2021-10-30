import { TestBed } from '@angular/core/testing';

import { GameService, OTHER_PLAYER, REAL_PLAYER } from './game.service';

describe('GameService', () => {
    let service: GameService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it("should emit tell virtualPlayerService it is his turn to play if it's the other player's turn\
    and we're converting the game from multiplayer to solo", () => {
        service.currentTurn = REAL_PLAYER;
        const spy = spyOn(service.otherPlayerSignal, 'next');
        service.numPlayers = 'multiplayer';
        service.convertGameToSolo();
        expect(spy).not.toHaveBeenCalled();

        service.currentTurn = OTHER_PLAYER;
        service.convertGameToSolo();
        expect(spy).toHaveBeenCalled();
    });
    it('should emit an abandon signal when we quit the game', () => {
        const spy = spyOn(service.abandonSignal, 'next');
        service.quitGame();
        expect(spy).toHaveBeenCalled();
    });
    it('should reset the skipcounter when the turn when the last move was not a skip', () => {
        service.skipCounter = 4;
        // eslint-disable-next-line dot-notation
        service['changeTurn'](false);
        const expectedValue = 0;
        expect(service.skipCounter).toEqual(expectedValue);
    });
});
