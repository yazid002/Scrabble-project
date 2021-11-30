import { GameState } from '@app/classes/game-state';
import { Server } from '@app/server';
import { Room, SocketManager } from '@app/services/socket-manager.service';
import { assert, expect } from 'chai';
import * as sinon from 'sinon';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';
// disable car on importe une constante du coté client, on doit utiliser un pattern
// eslint-disable-next-line no-restricted-imports
import { RESPONSE_DELAY } from '../../../client/src/app/constants/url';

describe('Socket manager service', () => {
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;
    beforeEach(() => {
        server = Container.get(Server);
        server.init();

        // eslint-disable-next-line dot-notation
        service = server['socketManger'];
        const urlString = 'http://localhost:3000';
        clientSocket = ioClient(urlString);
        clientSocket.connect();
        const room: Room = { id: 'someId', clients: ['someId'], settings: { mode: 'someMode', timer: 'someTime' }, name: 'Some name' };
        clientSocket.emit('createRoom', room.settings, clientSocket.id);
    });
    afterEach(() => {
        clientSocket.close();
        // eslint-disable-next-line dot-notation
        service['sio'].close();
    });

    it('should create a room when client emits createRoom signal', (done) => {
        const room: Room = { id: 'someId', clients: ['someId'], settings: { mode: 'someMode', timer: 'someTime' }, name: 'Some name' };
        const initialArraySize = service.rooms.length;

        clientSocket.emit('createRoom', room);
        setTimeout(() => {
            expect(service.rooms.length).greaterThan(initialArraySize);
            done();
        }, RESPONSE_DELAY);
    });

    it("should make the client socket join the romm asked on 'joinRoom'", (done) => {
        const room: Room = { id: 'someId', clients: ['someId'], settings: { mode: 'someMode', timer: 'someTime' }, name: 'Some name' };
        service.rooms.push(room);
        let askMasterSyncCount = 0;
        clientSocket.on('askMasterSync', () => {
            askMasterSyncCount++;
        });
        clientSocket.emit('joinRoom', room.id);
        setTimeout(() => {
            expect(askMasterSyncCount).greaterThan(0);
            done();
        }, RESPONSE_DELAY);
    });

    it("should emit room when client calls 'abandon'", (done) => {
        const room: Room = { id: 'someId', clients: ['some ID'], settings: { mode: 'someMode', timer: 'someTime' }, name: 'Some name' };
        service.rooms.push(room);
        clientSocket.emit('joinRoom', room.id);
        let receivedUserId = 0;

        clientSocket.on('rooms', () => {
            receivedUserId++;
        });
        clientSocket.emit('abandon', room.id, clientSocket.id);
        // eslint-disable-next-line dot-notation
        setTimeout(() => {
            expect(receivedUserId).greaterThan(0);
            done();
        }, RESPONSE_DELAY);
    });

    it('should emit current time every second', (done) => {
        let callCounter = 0;
        clientSocket.on('clock', () => {
            callCounter++;
        });
        const expectedResult = 5;
        const delay = 5500; // 5.5 seconds
        setTimeout(() => {
            expect(callCounter).to.equal(expectedResult);
            done();
        }, delay);
    });

    it('should emit a message with a body and user id when client sends a message and provides a roomId, useriD and body', (done) => {
        const receivedMessage = { roomId: '', userId: '', body: '' };
        const room: Room = { id: 'someId', clients: ['someId'], settings: { mode: 'someMode', timer: 'someTime' }, name: 'Some name' };
        service.rooms.push(room);
        const message = { roomId: room.id, userId: 'someId', body: 'Hello World' };
        clientSocket.emit('joinRoom', message.roomId);
        clientSocket.on('roomMessage', (userId: string, body: string, param3?: string) => {
            if (userId && message && param3) return; // Client emits 'roomMessage' with 3 params and the server responds with 2 params
            receivedMessage.userId = userId;
            receivedMessage.body = body;
        });

        clientSocket.emit('roomMessage', message.roomId, message.userId, message.body);

        setTimeout(() => {
            expect(receivedMessage.body).to.equal(message.body);
            expect(receivedMessage.userId).to.equal(message.userId);
            done();
        }, RESPONSE_DELAY);
    });

    it("should emit gameData to members in room when a client calls 'syncGameData'", (done) => {
        const sendGameState: GameState = {
            players: [],
            alphabetReserve: [],
            currentTurn: 1,
            skipCounter: 67,
            timer: 832,
            grid: [],
        };
        const receivedGameState: GameState = {
            players: [],
            alphabetReserve: [],
            currentTurn: 0,
            skipCounter: 0,
            timer: 0,
            grid: [],
        };
        const room: Room = { id: 'someId', clients: ['someId'], settings: { mode: 'someMode', timer: 'someTime' }, name: 'Some name' };
        service.rooms.push(room);
        const userId = 'someUser';
        clientSocket.emit('joinRoom', room.id);

        clientSocket.on('syncGameData', (user: string, gameState: GameState, roomId?: string) => {
            if (roomId && user && gameState) return; // server does not emit roomId (send back only 2 params)
            receivedGameState.currentTurn = gameState.currentTurn;
            receivedGameState.skipCounter = gameState.skipCounter;
            receivedGameState.timer = gameState.timer;
        });
        clientSocket.emit('syncGameData', room.id, userId, sendGameState);

        setTimeout(() => {
            expect(receivedGameState.timer).to.equal(sendGameState.timer);
            expect(receivedGameState.currentTurn).to.equal(sendGameState.currentTurn);
            expect(receivedGameState.skipCounter).to.equal(sendGameState.skipCounter);
            done();
        }, RESPONSE_DELAY);
    });
    it('should add clients socket id to the list of clients when he joins a room', (done) => {
        const oldRoom: Room = {
            id: 'an id',
            clients: ['an id'],
            name: 'a name',
            settings: { mode: 'a mode', timer: 'a time' },
        };
        service.rooms.push(oldRoom);
        const initialClientAmount = oldRoom.clients.length;
        clientSocket.emit('joinRoom', oldRoom.id);

        setTimeout(() => {
            const actual = service.rooms.find((room) => room === oldRoom);
            expect(actual?.clients.length).to.equal(initialClientAmount + 1);
            done();
        }, RESPONSE_DELAY);
    });

    it('should emit rooms when leaveRoom is emitted', (done) => {
        let callCounter = '';
        clientSocket.on('rooms', () => {
            callCounter = 'hello';
        });
        clientSocket.emit('leaveRoom');

        setTimeout(() => {
            // eslint-disable-next-line dot-notation
            expect(callCounter).to.equal('hello');
            done();
        }, RESPONSE_DELAY);
    });
    it('should call leaderboardService.endGame on endGame', (done) => {
        // eslint-disable-next-line dot-notation
        const endGameSpy = sinon.spy(service['leaderboardService'], 'endGame');
        clientSocket.emit('endGame', { name: 'a Name', score: 99, mode: 'classic' });
        setTimeout(() => {
            assert(endGameSpy.called);
            done();
        }, RESPONSE_DELAY);
    });
});
