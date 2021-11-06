import { Component, OnInit } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { ChatService } from '@app/services/chat.service';
import { CommandExecutionService } from '@app/services/command-execution/command-execution.service';

const MAX_MESSAGE_LENGTH = 512;
const MIN_MESSAGE_LENGTH = 1;
@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
    inputBox: string = '';
    error: boolean;
    errorMessage: string = '';
    messages: IChat[] = [];
    readonly possibleSenders = SENDER;

    constructor(public chatService: ChatService, private commandExecutionService: CommandExecutionService) {}

    ngOnInit(): void {
        this.getMessages();
        document.getElementsByTagName('input')[0].focus();
    }
    async validateFormat() {
        this.error = false;
        if (this.inputBox.length > MAX_MESSAGE_LENGTH || this.inputBox.length < MIN_MESSAGE_LENGTH) {
            this.error = true;
            this.errorMessage = `Min ${MIN_MESSAGE_LENGTH} et max ${MAX_MESSAGE_LENGTH} lettres`;
            return;
        }
        if (this.inputBox.startsWith('!')) {
            const answer = this.commandExecutionService.interpretCommand(this.inputBox);
            if (answer.error) {
                this.error = answer.error;
                this.errorMessage = (await answer.function()).body;
            }
        }
    }
    async onSubmit() {
        const message: IChat = {
            from: this.possibleSenders.me,
            body: this.inputBox,
        };
        this.chatService.addMessage(message);
        if (this.inputBox.startsWith('!')) {
            const response = await this.commandExecutionService.executeCommand(this.inputBox);

            this.chatService.addMessage(response.message);
        }

        this.inputBox = '';
        this.scrollDown();
    }
    private scrollDown() {
        const container = document.getElementById('message-history');

        if (container) {
            container.scrollTop = container.scrollHeight;
            container.scrollTo(0, container.scrollHeight);
        }
    }
    private getMessages(): void {
        this.chatService.getMessages().subscribe((messages) => (this.messages = messages));
    }
}
