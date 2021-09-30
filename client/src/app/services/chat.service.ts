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
    addMessage(newMessage: IChat): void {
        this.messages.push(newMessage);
    }
    clear(): void {
        this.messages = [];
    }
}
