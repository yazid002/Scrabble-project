import { Application } from '@app/app';
import { DateController } from '@app/controllers/date.controller';
import { ExampleController } from '@app/controllers/example.controller';
import { Room, SocketManager } from '@app/services/socket-manager.service';
import { expect } from 'chai';
import * as http from 'http';
import { io as ioClient, Socket } from 'socket.io-client';
import { DateService } from './date.service';
import { ExampleService } from './example.service';

describe('Socket manager service', () => {
    let service: SocketManager;
    let server: http.Server;
    let clientSocket: Socket;
    let application: Application;
    const appPort = '5020';
    const RESPONSE_DALAY = 100;
    beforeEach(() => {
        const dateService = new DateService();
        const exampleController = new ExampleController(new ExampleService(dateService));
        const dateController = new DateController(dateService);
        application = new Application(exampleController, dateController);
        application.app.set('port', appPort);
        server = http.createServer(application.app);
        service = new SocketManager(server);
        // eslint-disable-next-line dot-notation
        // service['sio'] = new MockedSocket();
        service.handleSockets();
        const urlString = 'http://localhost:5020';
        clientSocket = ioClient(urlString);
    });
    afterEach(() => {
        clientSocket.close();
        // eslint-disable-next-line dot-notation
        service['sio'].close();
    });

    it('should create a room when client emits createRoom signal', () => {
        clientSocket.connect();
        const room: Room = { id: 'someId', settings: { mode: 'someMode', timer: 'someTimee' } };
        const initialArraySize = service.rooms.length;

        clientSocket.emit('createRoom', room);
        setTimeout(() => {
            expect(service.rooms.length).greaterThan(initialArraySize);
        }, RESPONSE_DALAY);
    });
});
