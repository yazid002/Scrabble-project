import { Injectable } from '@angular/core';
import { IChat } from '@app/classes/chat';
import { Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    messages: IChat[] = [];

    getMessages(): Observable<IChat[]> {
        const obs = of(this.messages);
        return obs;
    }
    addMessage(message: string, sender: string): void {
        const newMessage: IChat = {
            from: sender,
            body: message,
        };
        this.messages.push(newMessage);
    }
    clear(): void {
        this.messages = [];
    }
}
