import { GameState } from '@app/classes/game-state';
import * as http from 'http';
import * as io from 'socket.io';

export interface Room {
    id: string;
    clientId: string[];
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

            socket.on('createRoom', (settings: { mode: string; timer: string }) => {
                const room: Room = {
                    clientId: [socket.id],
                    id: socket.id,
                    settings,
                };
                socket.join(room.id);
                this.rooms.push(room);
                console.log(this.rooms);
                // this.rooms = [...new Set(this.rooms)];
                this.sio.emit('rooms', this.rooms);
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

            socket.on('disconnect', (reason: string) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
                this.leaveRoom(socket.id);
                // const aRoom = this.rooms.find((room) => room.id === roomId);
                // aRoom?.numPlayers--;
                // if (aRoom?.numPlayers === 0) {
                //     const roomIndex = this.rooms.indexOf(aRoom);
                //     this.rooms.splice(roomIndex, 1);
                // }
            });
        });

        setInterval(() => {
            this.emitTime();
        }, 1000);
    }

    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }
    private leaveRoom(socketId: string) {
        console.log(this.rooms);
        const roomIndex = this.rooms.findIndex((room) => room.clientId.includes(socketId));
        if (roomIndex === -1) return;
        const clienIndex = this.rooms[roomIndex].clientId.findIndex((clientId) => clientId === socketId);
        if (clienIndex === -1) return;
        console.log('Leaveing room');
        console.log(this.rooms[roomIndex]);
        this.rooms[roomIndex].clientId.splice(clienIndex, 1);
        console.log(this.rooms[roomIndex]);
        if (this.rooms[roomIndex].clientId.length === 0) {
            this.rooms.splice(roomIndex, 1);
        }
    }
}
