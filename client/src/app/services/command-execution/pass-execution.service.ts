import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
@Injectable({
    providedIn: 'root',
})
export class PassExecutionService {
    execute(): IChat {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Vous avez passé votre tour !',
        };

        return result;
    }
}
