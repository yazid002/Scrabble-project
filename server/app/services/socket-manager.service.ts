import { GameState } from '@app/classes/game-state';
import * as http from 'http';
import * as io from 'socket.io';

export interface Room {
    id: string;
    numPlayers: number;
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
                const aRoom = this.rooms.find((room) => room.id === roomId);
                if (aRoom) {
                    aRoom.numPlayers++;
                }
                socket.join(roomId);
                this.sio.to(roomId).emit('askMasterSync');
            });

            socket.on('leaveRoom', (roomId: string) => {
                socket.leave(roomId);
                const aRoom = this.rooms.find((room) => room.id === roomId);
                if (aRoom) {
                    aRoom.numPlayers--;
                    if (aRoom.numPlayers === 0) {
                        const roomIndex = this.rooms.indexOf(aRoom);
                        this.rooms.splice(roomIndex, 1);
                    }
                }
            });

            socket.on('createRoom', (settings: { mode: string; timer: string }) => {
                const room: Room = {
                    numPlayers: 1,
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
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
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
}
