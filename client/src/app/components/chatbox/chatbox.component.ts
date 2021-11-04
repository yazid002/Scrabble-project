import { Component, HostListener, OnInit } from '@angular/core';
import { IChat, SENDER } from '@app/classes/chat';
import { CommandError } from '@app/classes/command-errors/command-error';
import { PLAYER } from '@app/classes/player';
import { SelectionType } from '@app/enums/selection-enum';
import { ChatService } from '@app/services/chat.service';
import { CommandExecutionService } from '@app/services/command-execution/command-execution.service';
import { GameService } from '@app/services/game.service';
import { SelectionManagerService } from '@app/services/selection-manager.service';

const MAX_MESSAGE_LENGTH = 512;
const MIN_MESSAGE_LENGTH = 1;
@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
    fromSelection: boolean = false;
    inputBox: string = '';
    error: boolean;
    errorMessage: string = '';
    messages: IChat[] = [];
    readonly possibleSenders = SENDER;

    constructor(
        public chatService: ChatService,
        private commandExecutionService: CommandExecutionService,
        private gameService: GameService,
        private selectionManager: SelectionManagerService,
    ) {}
    @HostListener('click', ['$event'])
    onLeftClick() {
        this.selectionManager.getSelectionType(SelectionType.Chat);
    }

    ngOnInit(): void {
        this.getMessages();
        document.getElementsByTagName('input')[0].focus();
    }

    // getInput(): string {
    //     return this.selectionInput !== '' ? this.selectionInput : this.inputBox;
    // }
    validateFormat() {
        // const input = this.getInput();
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
            //   response = await this.commandExecutionService.executeCommand(this.inputBox, !this.fromSelection);
            try {
                response = await this.commandExecutionService.executeCommand(this.inputBox, !this.fromSelection);
            } catch (error) {
                if (error instanceof CommandError) {
                    response = {
                        from: this.possibleSenders.computer,
                        body: error.message,
                    };
                } else {
                    throw error;
                }
            }
            this.chatService.addMessage(response);
        }

        this.inputBox = '';
        this.fromSelection = false;
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
