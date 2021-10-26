import { Server } from '@app/server';
import { Room, SocketManager } from '@app/services/socket-manager.service';
import { expect } from 'chai';
import { io as ioClient, Socket } from 'socket.io-client';
import Container from 'typedi';

describe('Socket manager service', () => {
    let service: SocketManager;
    let server: Server;
    let clientSocket: Socket;
    const RESPONSE_DALAY = 100;
    beforeEach(() => {
        server = Container.get(Server);
        server.init();

        // eslint-disable-next-line dot-notation
        service = server['socketManger'];
        const urlString = 'http://localhost:5020';
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

    it("should emit  'abandon' to the client's room when he on 'abandon", (done) => {
        const userId = 'someUser';

        let receivedUserId: string;
        clientSocket.on('abandon', (id: string) => {
            receivedUserId = id;
        });
        const serverRoom = 'serverRoom';
        // eslint-disable-next-line dot-notation
        server['sio'].join(serverRoom);
        // eslint-disable-next-line dot-notation
        server['sio'].to(serverRoom).emit('message', 'cool game');
        setTimeout(() => {
            expect(receivedUserId).to.equal(userId);
            done();
        }, RESPONSE_DALAY);
    });

    it('should emit current time every second', (done) => {
        let ca
        clientSocket.on('clock', () => {

        });
        setTimeout(() => {
            expect(receivedUserId).to.equal(userId);
            done();
        }, RESPONSE_DALAY);
    });
});
