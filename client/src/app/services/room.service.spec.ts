import { TestBed } from '@angular/core/testing';

import { RoomService } from './room.service';

describe('RoomService', () => {
    let service: RoomService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RoomService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should create a room with name = socket.id when createRoom is called', () => {
        service.roomId = 'NoneSense';
        service.createRoom();
        expect(service.roomId).toEqual(service.socket.id);
    });
    it('should not add message received to the message list if we are the sender', () => {
        // TODO demander comment on pourrait envoyer un message dans le test (et le recevoir par la suite)
    });
});
