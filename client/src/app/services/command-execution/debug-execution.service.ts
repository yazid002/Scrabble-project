import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';

@Injectable({
    providedIn: 'root',
})
export class DebugExecutionService {
    execute(): IChat {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Went through the debug execution service',
        };

        return result;
    }
}
