import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';

@Injectable({
    providedIn: 'root',
})
export class DebugExecutionService {
    execute(): IChat {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Commande debug exécutée avec succès !',
        };

        return result;
    }
}
