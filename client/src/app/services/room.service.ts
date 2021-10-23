import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ChatService } from './chat.service';
import { GameSyncService, GameState } from './game-sync.service';

@Injectable({
    providedIn: 'root',
})
export class RoomService {
    urlString: string;
    socket: Socket;
    roomId: string;
    chatServiceSubscription: Subscription;
    gameStateSubscription: Subscription;

    constructor(private chatService: ChatService, private gameSyncService: GameSyncService) {
        this.urlString = `http://${window.location.hostname}:5020`;
        this.socket = io(this.urlString);
        this.configureBaseSocketFeatures();
        this.configureRoomCommunication();
        this.chatServiceSubscription = this.chatService.messageSent.subscribe((message: string) => {
            // Send our message to the other players
            console.log('message emited');
            // socket.broadcast.to('game').emit('message', 'nice game');
            this.socket.emit('roomMessage', this.roomId, this.socket.id, message);
        });
        this.gameStateSubscription = this.gameSyncService.sendGameStateSignal.subscribe((gameState: GameState) => {
            this.socket.emit('syncGameData', this.roomId, this.socket.id, gameState);
        });
    }
    configureBaseSocketFeatures() {
        // Afficher l'identifiant du Socket dans l'interface
        this.socket.on('connect', () => {
            // document.getElementById('socketIdField').textContent = this.socket.id;
        });
    }

    configureRoomCommunication() {
        // Gérer l'événement envoyé par le serveur : afficher le message envoyé par un membre de la salle
        // this.joinRoom('patate'); // TODO : quand le lobby sera bien créé, on peut join une room plus approprié
        this.socket.on('roomMessage', (id: string, broadcastMessage: string) => {
            const message: IChat = { from: SENDER.otherPlayer, body: broadcastMessage };
            if (id === this.socket.id || !broadcastMessage) return;
            this.chatService.messages.push(message);
            console.log('Message received');
        });
        this.socket.on('syncGameData', (id: string, gameState: GameState) => {
            if (id === this.socket.id) return;
            this.gameSyncService.receiveFromServer(gameState);
        });
    }

    joinRoom(roomId: string) {
        this.socket.emit('joinRoom', roomId);
        this.roomId = roomId;
        this.gameSyncService.isMasterClient = false;
    }
    createRoom(name: string) {
        this.socket.emit('joinRoom', name);
        this.roomId = name; // TODO when lobby is complete, set to this.socket.id;
        this.gameSyncService.isMasterClient = true;
        this.gameSyncService.sendToServer();
    }
}
