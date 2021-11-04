import { TestBed } from '@angular/core/testing';
import { PLAYER } from '@app/classes/player';

import { VirtualPlayerService } from './virtual-player.service';

describe('VirtualPlayerService', () => {
    let service: VirtualPlayerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VirtualPlayerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    describe('place', () => {
        it('should add a message to the chatService of all possibilities it could have made if debug mode is active', () => {
            // eslint-disable-next-line dot-notation
            service['chatService'].messages = [];
            // eslint-disable-next-line dot-notation
            service['debugExecutionService'].state = true;

            // eslint-disable-next-line dot-notation
            service['gameService'].players[PLAYER.otherPlayer].rack = [
                { name: 'A', quantity: 9, points: 1, affiche: 'A' },
                { name: 'U', quantity: 0, points: 3, affiche: 'U' },
                { name: 'B', quantity: 0, points: 3, affiche: 'B' },
                { name: 'D', quantity: 3, points: 2, affiche: 'D' },
                { name: 'E', quantity: 15, points: 1, affiche: 'E' },
            ];
            // eslint-disable-next-line dot-notation
            service['place']();

            const expectedMessage = "L'ordinateur aurait pu placer: ";
            // eslint-disable-next-line dot-notation
            expect(service['chatService'].messages.map((message) => message.body)).toContain(expectedMessage);
        });

    });
});
