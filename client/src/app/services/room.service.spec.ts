import { TestBed } from '@angular/core/testing';
import { Socket } from 'socket.io-client';
import { GameState } from './game-sync.service';
import { Room, RoomService } from './room.service';

describe('RoomService', () => {
    let service: RoomService;
    let clientSocket: Socket;

    beforeEach(() => {
        clientSocket = jasmine.createSpyObj('socket', ['on', 'emit'], { id: '1' }) as unknown as Socket;
        TestBed.configureTestingModule({});
        service = TestBed.inject(RoomService);
        service.socket = clientSocket;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should create a room with name = socket.id when createRoom is called', () => {
        service.roomId = 'NoneSense';
        service.createRoom(); // TODO once lobby is finished, createroom should take no arguments
        expect(service.roomId).toEqual(service.socket.id);
    });
    it('should not add message received to the message list if we are the sender', () => {
        // TODO demander comment on pourrait envoyer un message dans le test (et le recevoir par la suite)
    });

    it('should emit joinRoom when joinRoom is called', () => {
        // const socketEmitSpy = spyOn(service.socket, 'emit');
        service.joinRoom('someRoom');
        expect(clientSocket.emit).toHaveBeenCalled();
    });

    it('should push message on receive roomMessage event', () => {
        // eslint-disable-next-line dot-notation
        clientSocket.on = (eventName: string, roomMessageCallback: (id: string, broadcastMessage: string) => void) => {
            if (eventName === 'roomMessage') {
                roomMessageCallback('2', '1');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return undefined as any;
        };
        // eslint-disable-next-line dot-notation
        const spy = spyOn(service['chatService']['messages'], 'push');
        service.configureRoomCommunication();
        expect(spy).toHaveBeenCalled();
    });

    it('should not push message on receive roomMessage event when message is sent to oneself (id is equal to socketId)', () => {
        // eslint-disable-next-line dot-notation
        clientSocket.on = (eventName: string, roomMessageCallback: (id: string, broadcastMessage: string) => void) => {
            if (eventName === 'roomMessage') {
                roomMessageCallback('1', '1');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return undefined as any;
        };
        // eslint-disable-next-line dot-notation
        const spy = spyOn(service['chatService']['messages'], 'push');
        service.configureRoomCommunication();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should sync game date on receive on receive syncGameData message', () => {
        // eslint-disable-next-line dot-notation
        const sendGameState: GameState = {
            players: [],
            alphabetReserve: [],
            currentTurn: 0,
            skipCounter: 0,
            timer: 0,
            grid: [],
        };
        clientSocket.on = (eventName: string, roomMessageCallback: (id: string, gameState: GameState) => void) => {
            if (eventName === 'syncGameData') {
                roomMessageCallback('2', sendGameState);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return undefined as any;
        };
        // eslint-disable-next-line dot-notation
        const spy = spyOn(service['gameSyncService'], 'receiveFromServer');
        service.configureRoomCommunication();
        expect(spy).toHaveBeenCalled();
    });

    it('should sync game date on receive syncGameData message', () => {
        // eslint-disable-next-line dot-notation
        const sendGameState: GameState = {
            players: [],
            alphabetReserve: [],
            currentTurn: 0,
            skipCounter: 0,
            timer: 0,
            grid: [],
        };
        clientSocket.on = (eventName: string, roomMessageCallback: (id: string, gameState: GameState) => void) => {
            if (eventName === 'syncGameData') {
                roomMessageCallback('1', sendGameState);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return undefined as any;
        };
        // eslint-disable-next-line dot-notation
        const spy = spyOn(service['gameSyncService'], 'receiveFromServer');
        service.configureRoomCommunication();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call solo game mode on receive abandon message', () => {
        // eslint-disable-next-line dot-notation
        clientSocket.on = (eventName: string, roomMessageCallback: (id: string) => void) => {
            if (eventName === 'abandon') {
                roomMessageCallback('2');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return undefined as any;
        };
        // eslint-disable-next-line dot-notation
        const spy = spyOn(service['gameService'], 'convertGameToSolo');
        service.configureRoomCommunication();
        expect(spy).toHaveBeenCalled();
    });

    it('should not call solo game mode on receive abandon message if socketid is equal to id', () => {
        // eslint-disable-next-line dot-notation
        clientSocket.on = (eventName: string, roomMessageCallback: (id: string) => void) => {
            if (eventName === 'abandon') {
                roomMessageCallback('1');
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return undefined as any;
        };
        // eslint-disable-next-line dot-notation
        const spy = spyOn(service['gameService'], 'convertGameToSolo');
        service.configureRoomCommunication();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should send to server on receive askMasterSync message if player is master client', () => {
        // eslint-disable-next-line dot-notation
        service['gameSyncService'].isMasterClient = true;
        // eslint-disable-next-line dot-notation
        clientSocket.on = (eventName: string, roomMessageCallback: () => void) => {
            if (eventName === 'askMasterSync') {
                roomMessageCallback();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return undefined as any;
        };
        // eslint-disable-next-line dot-notation
        const spy = spyOn(service['gameSyncService'], 'sendToServer');
        service.configureRoomCommunication();
        expect(spy).toHaveBeenCalled();
    });

    it('should not send to server on receive askMasterSync message if player is not master client', () => {
        // eslint-disable-next-line dot-notation
        service['gameSyncService'].isMasterClient = false;
        // eslint-disable-next-line dot-notation
        clientSocket.on = (eventName: string, roomMessageCallback: () => void) => {
            if (eventName === 'askMasterSync') {
                roomMessageCallback();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return undefined as any;
        };
        // eslint-disable-next-line dot-notation
        const spy = spyOn(service['gameSyncService'], 'sendToServer');
        service.configureRoomCommunication();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should room', () => {
        // eslint-disable-next-line dot-notation
        const room: Room[] = [{ id: 'abc', settings: { mode: 'multiplayer', timer: '1' } }];
        // eslint-disable-next-line dot-notation
        clientSocket.on = (eventName: string, roomMessageCallback: (rooms: Room[]) => void) => {
            if (eventName === 'rooms') {
                roomMessageCallback(room);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return undefined as any;
        };
        // eslint-disable-next-line dot-notation
        service.configureRoomCommunication();
        expect(service.rooms).toEqual(room);
    });
});
