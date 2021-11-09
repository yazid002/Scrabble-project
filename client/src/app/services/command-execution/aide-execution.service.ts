import { Command } from './../../classes/command-format';
import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';

@Injectable({
    providedIn: 'root',
})
export class AideExecutionService {
    // constructor() {}
    // command: Map<string, string> = new Map([
    //     ['placer:', '!placer Ligne(a-o)Colone(1-15)Sens(h|v) mot <br> permet de placer un mot sur le board <br>'],
    //     ['echanger: ', '!echanger lettres à échanger <br> permet de echanger les lettres designees <br>'],
    // ]);

    command: Command[] = [
        {
            nom: 'placer',
            format: '!placer Ligne(a-o)Colone(1-15)Sens(h|v) mot',
            description: ' permet de placer un mot sur le board',
        },
        {
            nom: 'echanger',
            format: '!echanger "lettres à échanger"',
            description: 'permet de echanger les lettres <br>mentionnés du rack',
        },
        {
            nom: 'debug',
            format: '!debug',
            description: 'La commande active et désactive <br>les affichages de débogage ',
        },
        {
            nom: 'reserve',
            format: '!reserve',
            description: 'permet d afficher l état du contenu <br>de la réserve en ordre alphabétique',
        },
    ];

    execute() {
        const result: IChat = {
            from: SENDER.computer,
            body: 'liste des commandes: <br>',
        };

        for (const i of this.command) {
            const line = `La commande ${i.nom}:<br> format: ${i.format}<br> description: ${i.description}<br><br>`;
            result.body += line;
        }

        return result;
    }
}
