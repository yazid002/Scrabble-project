import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    myForm: FormGroup;
    minLength: number = 0;
    maxLength: number = MAX_MESSAGE_LENGTH;
    messages: IChat[] = [];
    readonly possibleSenders = SENDER;

    constructor(public chatService: ChatService, private fb: FormBuilder, private commandExecutionService: CommandExecutionService) {}

    ngOnInit(): void {
        // const placerPattern = Validators.pattern('^!placer[\\s][a-z]+[0-9]+(h|v)[\\s][A-Za-z]+$');
        this.myForm = this.fb.group({
            message: ['', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]],
        });
        this.myForm.valueChanges.subscribe();
        this.getMessages();
    }
    get message() {
        const message = this.myForm.get('message');
        return message;
    }
    onSubmit() {
        if (!this.myForm.valid) return;
        const body = this.myForm.value.message;
        const message: IChat = { from: this.possibleSenders.me, body };
        this.chatService.addMessage(message);
        if (body.startsWith('!')) {
            const result: IChat = this.commandExecutionService.interpretCommand(body);

            this.chatService.addMessage(result);
        }
        // this.getMessages();
        this.myForm.reset();
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
