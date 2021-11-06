import { TestBed } from '@angular/core/testing';
import { PLAYER } from '@app/classes/player';
import { GameService } from './game.service';

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
        service.currentTurn = PLAYER.realPlayer;
        const spy = spyOn(service.otherPlayerSignal, 'next');
        service.numPlayers = 'multiplayer';
        service.convertGameToSolo();
        expect(spy).not.toHaveBeenCalled();

        service.currentTurn = PLAYER.otherPlayer;
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
    it('should call endGame if skipCounter >=6', () => {
        service.skipCounter = 6;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const spy = spyOn<any>(service, 'endGame');
        // eslint-disable-next-line dot-notation
        service['changeTurn'](true);
        expect(spy).toHaveBeenCalled();
    });
    it('should calculate points if one player has an empty rack and the reserve is empty when gameEnds', () => {
        service.players[0].rack = [];
        service.players[1].rack = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];
        // eslint-disable-next-line dot-notation
        service['reserveService'].alphabets = [];
        // eslint-disable-next-line dot-notation

        const expectedPoints = service.players[1].rack
            .map((letter) => letter.points)
            .reduce((accumulator, currentValue) => {
                return accumulator + currentValue;
            }, 0);
        // eslint-disable-next-line dot-notation
        service['endGame']();
        expect(service.players[0].points).toEqual(-expectedPoints);
        expect(service.players[1].points).toEqual(expectedPoints);
    });
    it('didGameEnd should return true if one player has an empty rack and the reserve is empty', () => {
        service.players[0].rack = [];
        service.players[1].rack = [
            { name: 'A', quantity: 9, points: 1, display: 'A' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'B', quantity: 0, points: 3, display: 'B' },
            { name: 'D', quantity: 3, points: 2, display: 'D' },
            { name: 'E', quantity: 15, points: 1, display: 'E' },
        ];
        // eslint-disable-next-line dot-notation
        service['reserveService'].alphabets = [];

        // eslint-disable-next-line dot-notation
        expect(service['didGameEnd']()).toEqual(true);
    });
    it('should never put a winning message to a player that has abandonned the game, even if they have more points', () => {
        service.players[PLAYER.realPlayer].points = 0;
        service.players[PLAYER.otherPlayer].points = 500;
        service.players[PLAYER.realPlayer].rack = [];
        service.players[PLAYER.otherPlayer].rack = [];
        const otherPlayerAbandonned = true;
        service.endGame(otherPlayerAbandonned);
        expect(service.players[PLAYER.otherPlayer].won).toEqual(undefined);
    });
});
