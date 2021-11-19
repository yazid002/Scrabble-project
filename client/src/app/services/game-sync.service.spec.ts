import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { GameSyncService } from './game-sync.service';
import { GridService } from './grid.service';

interface GridServiceMock {
    drawGrid(): void;
}

describe('GameSyncService', () => {
    let service: GameSyncService;

    beforeEach(() => {
        const gridServiceMock: GridServiceMock = {
            drawGrid: (): void => {
                return;
            },
        };
        TestBed.configureTestingModule({
            providers: [{ provide: GridService, useValue: gridServiceMock }],
            imports: [HttpClientModule],
        }).compileComponents();
        service = TestBed.inject(GameSyncService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should send gameData to server if the game is in multiplayer mode', () => {
        const spy = spyOn(service, 'sendToServer');
        // eslint-disable-next-line dot-notation
        service['gameService'].otherPlayerSignal.next('multiplayer');
        expect(spy).toHaveBeenCalled();
    });
    it("should send its data back to the server when 'receiveFormServer' is called and game has never been synced before", () => {
        // eslint-disable-next-line dot-notation
        service['alreadySynced'] = false;
        const spy = spyOn(service, 'sendToServer');

        // eslint-disable-next-line dot-notation
        service.receiveFromServer(service['getGameState']());
        expect(spy).toHaveBeenCalled();
    });
    it("should emit 'sendGameStateSignal' when method 'sendToSerever' is called", () => {
        const spy = spyOn(service.sendGameStateSignal, 'next');
        service.sendToServer();
        expect(spy).toHaveBeenCalled();
    });
    it("should get out of method 'initialize()' id service has already been initialized", () => {
        // eslint-disable-next-line dot-notation
        service['alreadyInitialized'] = true;
        // eslint-disable-next-line dot-notation
        service['alreadySynced'] = true; // if method executes, 'alreadySynced' is set to false.
        service.initialize();
        // eslint-disable-next-line dot-notation
        expect(service['alreadySynced']).toBe(true);
    });
    it('should not send gameData back to server when receiving data from server if the game has already been synced once', () => {
        // eslint-disable-next-line dot-notation
        service['alreadySynced'] = true;
        const spy = spyOn(service, 'sendToServer');
        // eslint-disable-next-line dot-notation
        service.receiveFromServer(service['getGameState']());
        expect(spy).not.toHaveBeenCalled();
    });
});
