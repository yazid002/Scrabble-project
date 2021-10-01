import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
@Injectable({
    providedIn: 'root',
})
export class PassExecutionService {
    execute(): IChat {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Commande passer exécutée avec succès !',
        };

        return result;
    }
}
