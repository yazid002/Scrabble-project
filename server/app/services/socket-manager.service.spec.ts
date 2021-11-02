// import { SocketManager } from '@app/services/socket-manager.service';
// import { expect } from 'chai';
// // import * as io from 'socket.io';
// import { io, Socket } from 'socket.io-client';
// import * as http from 'http';

// describe('Socket manager service', () => {
//     let service: SocketManager;
//     let server: http.Server;
//     let clientSocket: io.Socket;
//     beforeEach(() => {
//         server = http.createServer();
//         service = new SocketManager(server);
//         // eslint-disable-next-line dot-notation
//         service['sio'] = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
//         const urlString = `http://${window.location.hostname}:5020`;
//         service.handleSockets();
//         clientSocket = io(urlString);
//         clientSocket.emit()

//     });

//     it('should create', () => {
//         expect(service).to.not.equal(undefined);
//     });
//     it('should handle socket with no errors', () => {

//         expect(service.handleSockets).to.not.throw('error');
//     });
// });
