import { Injectable } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { Command } from './../../classes/command-format';

@Injectable({
    providedIn: 'root',
})
export class AideExecutionService {
    command: Command[] = [
        {
            nom: 'placer',
            format: '!placer Ligne(a-o)Colone(1-15)Sens(h|v) mot',
            description: 'Permet de placer un mot sur le board',
        },
        {
            nom: 'echanger',
            format: '!echanger "lettres à échanger"',
            description: "Permet d'échanger les lettres <br>mentionnés du rack",
        },
        {
            nom: 'passer',
            format: '!passer',
            description: 'Permet de passer son tour',
        },
        {
            nom: 'debug',
            format: '!debug',
            description: 'La commande active et désactive <br>les affichages de débogage ',
        },
        {
            nom: 'reserve',
            format: '!reserve',
            description: "Permet d'afficher l'état du contenu <br>de la réserve en ordre alphabétique",
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
