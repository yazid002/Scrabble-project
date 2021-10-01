import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { ReserveService } from '@app/services/reserve.service';
@Injectable({
    providedIn: 'root',
})
export class ReserveExecutionService {
    constructor(private reserveService: ReserveService) {}

    execute(): IChat {
        const result: IChat = {
            from: SENDER.computer,
            body: 'Commande reserve exécutée avec succès !',
        };
        for (const letter of this.reserveService.alphabets) {
            const line = `\n<br>${letter.name}: ${letter.quantity}`;
            result.body += line;
        }

        return result;
    }
}
