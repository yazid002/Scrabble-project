import { GameState } from '@app/classes/game-state';
import * as http from 'http';
import * as io from 'socket.io';

interface Room {
    id: string;
    settings: { mode: string; timer: string };
}

export class SocketManager {
    rooms: Room[] = [];
    private sio: io.Server;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket: io.Socket) => {
            this.sio.emit('rooms', this.rooms);
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            // message initial
            socket.emit('hello', 'Hello World!');

            socket.on('message', (message: string) => {
                console.log(message);
            });
            socket.on('validate', (word: string) => {
                const isValid = word.length > 5;
                socket.emit('wordValidated', isValid);
            });

            socket.on('broadcastAll', (message: string) => {
                this.sio.sockets.emit('massMessage', `${socket.id} : ${message}`);
            });

            socket.on('joinRoom', (roomId: string) => {
                /** server makes socket join room
                 *
                 * @param roomId: provide a roomId to join a specific room
                 */

                socket.join(roomId);
                this.sio.to(roomId).emit('askMasterSync');
            });

            // socket.on('leaveRoom', (roomId: string) => {
            //     socket.leave(roomId);
            // });

            socket.on('createRoom', (settings: { mode: string; timer: string }) => {
                const room: Room = {
                    id: socket.id,
                    settings,
                };
                socket.join(room.id);
                this.rooms.push(room);
                this.rooms = [...new Set(this.rooms)]; // Remove possible duplicates
                console.log('Created room', socket.id);
                this.sio.emit('rooms', this.rooms);
            });

            socket.on('abandon', (roomId: string, userId: string) => {
                this.sio.to(roomId).emit('abandon', userId);
            });

            socket.on('roomMessage', (roomId: string, userId: string, message: string) => {
                // socket.broadcast.to('joinRoom').emit("roomMessage", `${socket.id} : ${message}`);

                this.sio.to(roomId).emit('roomMessage', userId, message);
            });
            socket.on('syncGameData', (roomId: string, userId: string, gameState: GameState) => {
                console.log('Received sync signal from client in room ' + roomId);
                this.sio.to(roomId).emit('syncGameData', userId, gameState);
            });

            socket.on('disconnect', (reason: string) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });
        });

        setInterval(() => {
            this.emitTime();
        }, 1000);
    }

    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }
}
