import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Message } from '@app/classes/message';
import { GameModeDialogComponent } from '@app/components/dialogs/game-mode-dialog/game-mode-dialog.component';
import { CommunicationService } from '@app/services/communication.service';
import { UserSettingsService } from '@app/services/user-settings.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';

    message: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor(
        public dialog: MatDialog,
        private readonly communicationService: CommunicationService,
        public userSettingsService: UserSettingsService,
    ) {}

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

    chooseMode(modeKey: string) {
        this.userSettingsService.settings.mode.currentChoiceKey = modeKey;
        this.openDialog();
    }
    private openDialog() {
        this.dialog.open(GameModeDialogComponent);
    }
}
