import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IChat, SENDER } from '@app/classes/chat';
import { Subscription } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ChatService } from './chat.service';
import { GameState, GameSyncService } from './game-sync.service';
import { GameService } from './game.service';
import { UserSettingsService } from './user-settings.service';
export interface Room {
    id: string;
    name: string;
    settings: { mode: string; timer: string };
}
@Injectable({
    providedIn: 'root',
})
export class RoomService {
    urlString: string;
    socket: Socket;
    roomId: string;
    chatServiceSubscription: Subscription;
    gameStateSubscription: Subscription;
    abandonSubscription: Subscription;
    rooms: Room[];

    constructor(
        private chatService: ChatService,
        private gameSyncService: GameSyncService,
        private gameService: GameService,
        private userSettingsService: UserSettingsService,
        private router: Router,
    ) {
        this.urlString = 'ec2-99-79-57-8.ca-central-1.compute.amazonaws.com:3000';
        this.urlString = '127.0.0.1:3000';
        this.socket = io(this.urlString);
        this.configureRoomCommunication();
        this.chatServiceSubscription = this.chatService.messageSent.subscribe((message: string) => {
            // Send our message to the other players
            // socket.broadcast.to('game').emit('message', 'nice game');
            this.socket.emit('roomMessage', this.roomId, this.socket.id, message);
        });
        this.gameStateSubscription = this.gameSyncService.sendGameStateSignal.subscribe((gameState: GameState) => {
            this.socket.emit('syncGameData', this.roomId, this.socket.id, gameState);
        });
        this.abandonSubscription = this.gameSyncService.sendAbandonSignal.subscribe(() => {
            this.socket.emit('abandon', this.roomId, this.socket.id);
        });
        this.rooms = [];
    }

    configureRoomCommunication() {
        // Gérer l'événement envoyé par le serveur : afficher le message envoyé par un membre de la salle
        // this.joinRoom('patate'); // TODO : quand le lobby sera bien créé, on peut join une room plus approprié
        this.socket.on('roomMessage', (id: string, broadcastMessage: string) => {
            const message: IChat = { from: SENDER.otherPlayer, body: broadcastMessage };
            if (id === this.socket.id || !broadcastMessage) return;
            this.chatService.messages.push(message);
        });
        this.socket.on('syncGameData', (id: string, gameState: GameState) => {
            if (id === this.socket.id) return;
            this.gameSyncService.receiveFromServer(gameState);
        });
        this.socket.on('abandon', (id: string) => {
            if (id === this.socket.id) return;
            this.gameService.endGame(true);
            // this.gameService.convertGameToSolo(); Uncomment for sprint 3
        });
        this.socket.on('askMasterSync', () => {
            this.router.navigateByUrl('/game');
            if (!this.gameSyncService.isMasterClient) return;
            this.gameSyncService.sendToServer();
        });
        this.socket.on('setRoomId', (roomId: string) => {
            this.roomId = roomId;
        });
        this.socket.on('rooms', (rooms: Room[]) => {
            this.rooms = rooms;
        });
    }

    joinRoom(roomId: string) {
        if (this.roomId || this.roomId !== '') {
            this.quitRoom();
        }
        this.socket.emit('joinRoom', roomId);
        this.roomId = roomId;
        this.gameSyncService.isMasterClient = false;
    }
    createRoom() {
        const settings = this.userSettingsService.getSettings();
        const userName = this.gameService.players[0].name;
        this.socket.emit('createRoom', settings, userName);

        // this.roomId = this.socket.id;

        this.gameSyncService.isMasterClient = true;
        return this.roomId;
    }

    quitRoom() {
        this.socket.emit('leaveRoom');
        this.roomId = '';
    }
}
