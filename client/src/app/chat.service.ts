import { Injectable } from '@angular/core';
import { IChat, ME } from './chat';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    messages: IChat[] = [];

    getMessages() {
        return this.messages;
    }
    addMessage(message: string): void {
        const newMessage: IChat = {
            from: ME,
            body: message,
        };
        this.messages.push(newMessage);
    }
    clear(): void {
        this.messages = [];
    }
}
