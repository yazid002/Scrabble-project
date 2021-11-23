import { GameState } from '@app/classes/game-state';
import * as http from 'http';
import * as io from 'socket.io';

const ROOM_NOT_FOUND_INDEX = -1;
const EMIT_TIME_DELAY = 1000;
const ABANDON_TIMER = 5000;

export interface Room {
    id: string;
    clients: string[];
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
            socket.on('joinRoom', (roomId: string) => {
                /** server makes socket join room
                 *
                 * @param roomId: provide a roomId to join a specific room
                 */
                const aRoomIndex = this.rooms.findIndex((room) => room.id === roomId);
                if (aRoomIndex === ROOM_NOT_FOUND_INDEX) return;
                this.rooms[aRoomIndex].clients.push(socket.id);
                socket.join(roomId);
                this.sio.to(roomId).emit('askMasterSync');
            });

            socket.on('leaveRoom', () => {
                this.leaveRoom(socket.id);
            });

            socket.on('createRoom', (settings: { mode: string; timer: string }, userName: string) => {
                const room: Room = {
                    name: userName,
                    clients: [socket.id],
                    id: socket.id,
                    settings,
                };
                socket.join(room.id);
                this.rooms.push(room);
                this.sendRooms();
                socket.emit('setRoomId', socket.id);
            });

            socket.on('abandon', (roomId: string, userId: string) => {
                this.sio.to(roomId).emit('abandon', userId);
                this.leaveRoom(socket.id);
            });

            socket.on('roomMessage', (roomId: string, userId: string, message: string) => {
                this.sio.to(roomId).emit('roomMessage', userId, message);
            });
            socket.on('syncGameData', (roomId: string, userId: string, gameState: GameState) => {
                this.sio.to(roomId).emit('syncGameData', userId, gameState);
            });

            socket.on('disconnect', () => {
                setTimeout(() => {
                    const room = this.rooms.find((element) => element.clients.includes(socket.id));
                    if (!room) return;
                    this.sio.to(room.id).emit('abandon', socket.id);
                    this.leaveRoom(socket.id);
                }, ABANDON_TIMER);
            });
        });

        setInterval(() => {
            this.emitTime();
        }, EMIT_TIME_DELAY);
    }
    private sendRooms() {
        this.rooms.filter((room) => room.name !== '');
        this.sio.emit('rooms', this.rooms);
    }
    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }
    private leaveRoom(socketId: string) {
        const roomIndex = this.rooms.findIndex((room) => room.clients.includes(socketId));
        if (roomIndex === ROOM_NOT_FOUND_INDEX) return;
        const clientIndex = this.rooms[roomIndex].clients.findIndex((client) => client === socketId);
        this.rooms[roomIndex].clients.splice(clientIndex, 1);
        if (this.rooms[roomIndex].clients.length === 0) {
            this.rooms.splice(roomIndex, 1);
        }
        this.sio.emit('rooms', this.rooms);
    }

    // private sendPlayer() {

    //     this.sio.sockets.emit('player', this.player);
    // }
}
