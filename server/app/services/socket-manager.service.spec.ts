import { GameState } from '@app/classes/game-state';
import { Server } from '@app/server';
import { Room, SocketManager } from '@app/services/socket-manager.service';
import { expect } from 'chai';
import { io as ioClient, Socket } from 'socket.io-client';
import { Container } from 'typedi';

describe('Socket manager service', () => {
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;
    const RESPONSE_DALAY = 1000;
    beforeEach(() => {
        server = Container.get(Server);
        server.init();

        // eslint-disable-next-line dot-notation
        service = server['socketManger'];
        const urlString = 'http://localhost:3000';
        clientSocket = ioClient(urlString);
        clientSocket.connect();
    });
    afterEach(() => {
        clientSocket.close();
        // eslint-disable-next-line dot-notation
        service['sio'].close();
    });

    it('should create a room when client emits createRoom signal', (done) => {
        const room: Room = { id: 'someId', settings: { mode: 'someMode', timer: 'someTime' } };
        const initialArraySize = service.rooms.length;

        clientSocket.emit('createRoom', room);
        setTimeout(() => {
            expect(service.rooms.length).greaterThan(initialArraySize);
            done();
        }, RESPONSE_DALAY);
    });

    it("should make the client socket join the romm asked on 'joinRoom'", (done) => {
        const roomId = 'someRoom';
        let askMasterSyncCount = 0;
        clientSocket.on('askMasterSync', () => {
            askMasterSyncCount++;
        });
        clientSocket.emit('joinRoom', roomId);
        setTimeout(() => {
            expect(askMasterSyncCount).greaterThan(0);
            done();
        }, RESPONSE_DALAY);
    });

    it("should emit 'abandon' to the client's room when he calls 'abandon'", (done) => {
        const userId = 'someUser';
        const roomId = 'someRoom';
        let receivedUserId = '';

        clientSocket.on('abandon', (id: string, otherParams?: string) => {
            if (otherParams && id) return; // client emit 'abandon' with 2 params : userId and roomId, while client responds with only 1 param: userId
            receivedUserId = id;
        });
        clientSocket.emit('joinRoom', roomId);
        clientSocket.emit('abandon', roomId, userId);
        // eslint-disable-next-line dot-notation
        setTimeout(() => {
            expect(receivedUserId).to.equal(userId);
            done();
        }, RESPONSE_DALAY);
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
        const message = { roomId: 'someRoom', userId: 'someId', body: 'Hello World' };
        const receivedMessage = { roomId: '', userId: '', body: '' };

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
        }, RESPONSE_DALAY);
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
        const roomId = 'someRoom';
        const userId = 'someUser';
        clientSocket.emit('joinRoom', roomId);

        clientSocket.on('syncGameData', (user: string, gameState: GameState, room?: string) => {
            if (room && user && gameState) return; // server does not emit roomId (send back only 2 params)
            receivedGameState.currentTurn = gameState.currentTurn;
            receivedGameState.skipCounter = gameState.skipCounter;
            receivedGameState.timer = gameState.timer;
        });
        clientSocket.emit('syncGameData', roomId, userId, sendGameState);

        setTimeout(() => {
            expect(receivedGameState.timer).to.equal(sendGameState.timer);
            expect(receivedGameState.currentTurn).to.equal(sendGameState.currentTurn);
            expect(receivedGameState.skipCounter).to.equal(sendGameState.skipCounter);
            done();
        }, RESPONSE_DALAY);
    });
});
