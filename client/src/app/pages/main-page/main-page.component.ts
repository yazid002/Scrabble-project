import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameModeDialogComponent } from '@app/components/dialogs/game-mode-dialog/game-mode-dialog.component';
import { Message } from '@app/classes/message';
import { CommunicationService } from '@app/services/communication.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly userChoices = {
        classic: 'Mode Classique',
        log2990: 'Mode LOG2990',
    };

    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor(public dialog: MatDialog, private readonly communicationService: CommunicationService) {}

    sendTimeToServer(): void {
        const newTimeMessage: Message = {
            title: 'Hello from the client',
            body: 'Time is : ' + new Date().toString(),
        };
        // Important de ne pas oublier "subscribe" ou l'appel ne sera jamais lancé puisque personne l'observe
        this.communicationService.basicPost(newTimeMessage).subscribe();
    }

    getMessagesFromServer(): void {
        this.communicationService
            .basicGet()
            // Cette étape transforme l'objet Message en un seul string
            .pipe(
                map((message: Message) => {
                    return `${message.title} ${message.body}`;
                }),
            )
            .subscribe(this.message);
    }
    openDialog(mode: string) {
        mode.replace('c', 'c');
        if (mode === this.userChoices.classic) {
            this.dialog.open(GameModeDialogComponent);
        } else if (mode === this.userChoices.log2990) {
            window.alert(mode + ' is unavailable at the moment');
        }
    }
}
