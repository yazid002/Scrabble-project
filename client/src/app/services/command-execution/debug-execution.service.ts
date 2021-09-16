import { Injectable } from '@angular/core';
import { IChat, IComputerResponse, SENDER } from '@app/classes/chat';

@Injectable({
    providedIn: 'root',
})
export class DebugExecutionService {
    execute(): IComputerResponse {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Went throught the debug execution service',
        };
        const response: IComputerResponse = {
            success: true,
            response: result,
        };
        return response;
    }
}
