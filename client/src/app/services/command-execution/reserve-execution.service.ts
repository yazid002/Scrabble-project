import { Injectable } from '@angular/core';
import { IChat, IComputerResponse, SENDER } from '@app/classes/chat';
import { ReserveService } from '@app/services/reserve.service';
@Injectable({
    providedIn: 'root',
})
export class ReserveExecutionService {
    constructor(private reserveService: ReserveService) {}

    execute(): IComputerResponse {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Went through the reserve execution service ',
        };
        for (const letter of this.reserveService.alphabets) {
            const line = `${letter.name}: ${letter.quantity}
            \n<br>`;
            result.body += line;
        }
        const response: IComputerResponse = {
            success: true,
            response: result,
        };
        return response;
    }
}
