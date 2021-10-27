import { GameState } from '@app/classes/game-state';
import * as http from 'http';
import * as io from 'socket.io';

export interface Room {
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

            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);

            socket.on('joinRoom', (roomId: string) => {
                socket.join(roomId);
                this.sio.to(roomId).emit('askMasterSync');
            });

            socket.on('createRoom', (settings: { mode: string; timer: string }) => {
                const room: Room = {
                    id: socket.id,
                    settings,
                };
                socket.join(room.id);
                this.rooms.push(room);
                this.rooms = [...new Set(this.rooms)];
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
                this.sio.to(roomId).emit('syncGameData', userId, gameState);
            });

            socket.on('disconnect', (reason: string) => {
                // eslint-disable-next-line no-console
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}\nRaison de deconnexion : ${reason}`);
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
