import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IChat, SENDER } from '@app/classes/chat';
import { ChatService } from '@app/services/chat.service';
import { CommandExecutionService } from '@app/services/command-execution/command-execution.service';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
    myForm: FormGroup;
    minLength: number = 0;
    maxLength: number = 512;
    messages: IChat[] = [];
    readonly possibleSenders = SENDER;

    constructor(public chatService: ChatService, private fb: FormBuilder, private commandExecutionService: CommandExecutionService) {}

    ngOnInit(): void {
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
    getMessages(): void {
        this.chatService.getMessages().subscribe((messages) => (this.messages = messages));
    }
    onSubmit() {
        const body = this.myForm.value.message;
        if (body.startsWith('!')) {
            const result: IChat = this.commandExecutionService.interpretCommand(body);

            this.chatService.addMessage(body, this.possibleSenders.me);
            this.chatService.addMessage(result.body, result.from);
        } else {
            this.chatService.addMessage(body, this.possibleSenders.me);
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
