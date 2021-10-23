import { Injectable, Output } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    @Output() messageSent = new BehaviorSubject<string>('');
    messages: IChat[] = [];

    getMessages(): Observable<IChat[]> {
        const obs = of(this.messages);
        return obs;
    }
    addMessage(newMessage: IChat): void {
        this.messages.push(newMessage);
        if (newMessage.body.startsWith('!') || newMessage.from !== SENDER.me) return;
        this.messageSent.next(newMessage.body);
    }
    clear(): void {
        this.messages = [];
    }
}
