import { Component, OnInit } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { CommandError } from '@app/classes/command-errors/command-error';
import { ChatService } from '@app/services/chat.service';
import { CommandExecutionService } from '@app/services/command-execution/command-execution.service';
import { GameService } from '@app/services/game.service';
import { PLAYER } from '@app/classes/player';

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

    constructor(public chatService: ChatService, private commandExecutionService: CommandExecutionService, private gameService: GameService) {}

    ngOnInit(): void {
        this.getMessages();
        document.getElementsByTagName('input')[0].focus();
    }
    validateFormat() {
        this.error = false;
        if (this.inputBox.length > MAX_MESSAGE_LENGTH || this.inputBox.length < MIN_MESSAGE_LENGTH) {
            this.error = true;
            this.errorMessage = `Min ${MIN_MESSAGE_LENGTH} et max ${MAX_MESSAGE_LENGTH} lettres`;
            return;
        }
        if (this.inputBox.startsWith('!')) {
            if (this.gameService.currentTurn !== PLAYER.realPlayer) {
                this.error = true;
                this.errorMessage = 'Attendez votre tour';
                return;
            }
            try {
                this.commandExecutionService.interpretCommand(this.inputBox);
                this.error = false;
            } catch (error) {
                if (error instanceof CommandError) {
                    this.errorMessage = error.message;
                    this.error = true;
                }
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
            let response: IChat = { from: '', body: '' };
            try {
                response = await this.commandExecutionService.executeCommand(this.inputBox);
            } catch (error) {
                if (error instanceof CommandError) {
                    response = {
                        from: this.possibleSenders.computer,
                        body: error.message,
                    };
                }
            }
            this.chatService.addMessage(response);
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
