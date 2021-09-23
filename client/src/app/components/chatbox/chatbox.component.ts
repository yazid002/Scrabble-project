import { Component, OnInit } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';

import { ChatService } from '@app/services/chat.service';
import { CommandExecutionService } from '@app/services/command-execution/command-execution.service';

const MAX_MESSAGE_LENGTH = 512;
@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
    inputBox: string = '';
    error: boolean;
    errorMessage: string;
    minLength: number = 0;
    maxLength: number = MAX_MESSAGE_LENGTH;
    messages: IChat[] = [];
    readonly possibleSenders = SENDER;

    constructor(public chatService: ChatService, private commandExecutionService: CommandExecutionService) {}

    ngOnInit(): void {
        // const placerPattern = Validators.pattern('^!placer[\\s][a-z]+[0-9]+(h|v)[\\s][A-Za-z]+$');

        this.getMessages();
    }
    validateFormat() {
        // /^placer[\\s][a-z]+[0-9]+(h|v)[\\s][A-Za-z]+$/.test(this.inputBox)
        console.log(this.inputBox);
        if (this.inputBox.startsWith('!')) {
            const result: IChat = this.commandExecutionService.interpretCommand(this.inputBox, false);
            this.errorMessage = result.body;
            

            
            
        } else {
            this.error = false;
            this.errorMessage = 'valide';
        }
        this.error = true;
        // else {
        //     this.error = true;
        //     this.errorMessage = 'ereur';
        // }
    }
    onSubmit() {
        console.log('onSubmit');
        const message: IChat = { from: this.possibleSenders.me, body: this.inputBox };
        this.chatService.addMessage(message);
        
        if (this.inputBox.startsWith('!')) {
            const result: IChat = this.commandExecutionService.interpretCommand(this.inputBox, true);

            this.chatService.addMessage(result);
        }
        // this.getMessages();
        this.inputBox = '';
        this.scrollDown();
    }
    private scrollDown() {
        const cont1 = document.getElementById('message-history');

        if (cont1) {
            cont1.scrollTop = cont1.scrollHeight;
            cont1.scrollTo(0, cont1.scrollHeight);
        }
    }
    private getMessages(): void {
        this.chatService.getMessages().subscribe((messages) => (this.messages = messages));
    }
}
