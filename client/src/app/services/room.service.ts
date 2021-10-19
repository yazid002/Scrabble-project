import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ChatService } from './chat.service';

@Injectable({
    providedIn: 'root',
})
export class RoomService {
    urlString: string;
    socket: Socket;
    chatServiceSubscription: Subscription;

    constructor(private chatService: ChatService) {
        this.urlString = 'http://localhost:5020';
        this.socket = io(this.urlString);
        this.configureBaseSocketFeatures();
        this.configureRoomCommunication();
        this.chatServiceSubscription = this.chatService.messageSent.subscribe((message: string) => {
            // Send our message to the other players
            console.log('message emited');
            // socket.broadcast.to('game').emit('message', 'nice game');
            this.socket.emit('roomMessage', this.socket.id, message);
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
        this.socket.emit('joinRoom');
        this.socket.on('roomMessage', (id: string, broadcastMessage: string) => {
            const message: IChat = { from: SENDER.otherPlayer, body: broadcastMessage };
            if (id === this.socket.id) return;
            this.chatService.messages.push(message);
            console.log('Message received');
        });
    }
}
