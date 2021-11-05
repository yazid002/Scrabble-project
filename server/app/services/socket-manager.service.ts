import { GameState } from '@app/classes/game-state';
import * as http from 'http';
import * as io from 'socket.io';

export interface Room {
    id: string;
    name: string;
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
            this.sendRooms();

            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);

            socket.on('joinRoom', (roomId: string) => {
                /** server makes socket join room
                 *
                 * @param roomId: provide a roomId to join a specific room
                 */
                const aRoomIndex = this.rooms.findIndex((room) => room.id === roomId);
                if (aRoomIndex !== -1) {
                    this.rooms.splice(aRoomIndex, 1);
                }
                socket.join(roomId);
                this.sio.to(roomId).emit('askMasterSync');
            });

            socket.on('leaveRoom', () => {
                this.leaveRoom(socket.id);
            });

            socket.on('createRoom', (settings: { mode: string; timer: string }, userName: string) => {
                const room: Room = {
                    name: userName,
                    id: socket.id,
                    settings,
                };
                socket.join(room.id);
                this.rooms.push(room);
                console.log(this.rooms);
                // this.rooms = [...new Set(this.rooms)];
                this.sendRooms();
                socket.emit('setRoomId', socket.id);
            });

            socket.on('abandon', (roomId: string, userId: string) => {
                this.sio.to(roomId).emit('abandon', userId);
                this.leaveRoom(socket.id);
            });

            socket.on('roomMessage', (roomId: string, userId: string, message: string) => {
                // socket.broadcast.to('joinRoom').emit("roomMessage", `${socket.id} : ${message}`);

                this.sio.to(roomId).emit('roomMessage', userId, message);
            });
            socket.on('syncGameData', (roomId: string, userId: string, gameState: GameState) => {
                this.sio.to(roomId).emit('syncGameData', userId, gameState);
            });

            socket.on('disconnect', () => {
                socket.on('disconnect', () => {
                    this.leaveRoom(socket.id);
                    this.sio.emit('abandon', socket.id);
                });
            });
        });

        setInterval(() => {
            this.emitTime();
        }, 1000);
    }
    private sendRooms() {
        this.rooms.filter((room) => room.name !== '');
        this.sio.emit('rooms', this.rooms);
    }
    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }
    private leaveRoom(socketId: string) {
        console.log(this.rooms);
        const roomIndex = this.rooms.findIndex((room) => room.id === socketId);
        if (roomIndex === -1) return;
        this.rooms.splice(roomIndex, 1);
        this.sio.emit('rooms', this.rooms);
    }
}
