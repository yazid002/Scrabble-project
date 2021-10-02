import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { ReserveService } from '@app/services/reserve.service';
import { DebugExecutionService } from './debug-execution.service';

@Injectable({
    providedIn: 'root',
})
export class ReserveExecutionService {
    constructor(private reserveService: ReserveService, private debugExecutionService: DebugExecutionService) {}

    execute(): IChat {
        let result: IChat = {
            from: SENDER.computer,
            body: 'La commande <strong>reserve</strong> est uniquement disponible lorsque le mode débogage est activé',
        };
        if (this.debugExecutionService.state) {
            result = this.buildReserveMessage();
        }

        return result;
    }
    private buildReserveMessage(): IChat {
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
