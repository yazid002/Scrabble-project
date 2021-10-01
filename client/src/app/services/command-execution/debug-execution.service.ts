import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';

@Injectable({
    providedIn: 'root',
})
export class DebugExecutionService {
    state: boolean = false; // Donne l'état de debug

    execute(): IChat {
        this.state = !this.state;
        const result: IChat = {
            from: SENDER.computer,
            body: this.state ? 'affichages de débogage activés' : 'affichages de débogage désactivés',
        };

        return result;
    }
}
