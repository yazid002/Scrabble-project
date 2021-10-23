import * as http from 'http';
import * as io from 'socket.io';
import { GameState } from '@app/classes/game-state';

export class SocketManager {
    rooms: string[] = [];
    private sio: io.Server;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket: io.Socket) => {
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

            socket.on('joinRoom', (roomId?: string) => {
                /** server makes socket join room and creates the room if necessary
                 *
                 * @param roomId: provide a roomId to join a specific room or do not provide a roomId and a room will be created from your socket id
                */
                
                if (roomId) {
                    socket.join(roomId);
                    this.rooms.push(roomId);
                } else {
                    socket.join(socket.id);
                    this.rooms.push(socket.id);
                }
                this.rooms = [...new Set(this.rooms)]; // Remove possible duplicates
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
