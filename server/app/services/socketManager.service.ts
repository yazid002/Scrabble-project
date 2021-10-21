import * as io from 'socket.io';
import * as http from 'http';

export class SocketManager {
    // Class inspired from Nikolay's socket communication example
    private sio: io.Server;
    private room: string = 'serverRoom';
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
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

            socket.on('joinRoom', () => {
                socket.join(this.room);
            });

            socket.on('roomMessage', (id: string, message: string) => {
                // socket.broadcast.to('joinRoom').emit("roomMessage", `${socket.id} : ${message}`);
                this.sio.to(this.room).emit('roomMessage', id, message);
            });

            socket.on('disconnect', (reason) => {
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
