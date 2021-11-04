import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { ReserveService } from '@app/services/reserve.service';

@Injectable({
    providedIn: 'root',
})
export class ReserveExecutionService {
    constructor(private reserveService: ReserveService) {}

    execute() {
        const result: IChat = {
            from: SENDER.computer,
            body: '',
        };
        for (const letter of this.reserveService.alphabets) {
            const line = `${letter.name}: ${letter.quantity}<br>`;
            result.body += line;
        }

        return result;
    }
}
