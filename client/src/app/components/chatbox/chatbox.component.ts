import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IChat } from '@app/classes/chat';
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

    constructor(public chatService: ChatService, private fb: FormBuilder, private commandExecutionService: CommandExecutionService) {}

    ngOnInit(): void {
        this.myForm = this.fb.group({
            message: ['', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]],
        });
        this.myForm.valueChanges.subscribe(/* console.log*/);
        this.getMessages();
    }
    get message() {
        const message = this.myForm.get('message');
        // console.log('message min length:');
        // console.log(message?.errors?.minlength);
        return message;
    }
    getMessages(): void {
        this.chatService.getMessages().subscribe((messages) => (this.messages = messages));
    }
    onSubmit() {
        console.log('starting submission');
        const body = this.myForm.value.message;
        console.warn(body);
        if (body.startsWith('!')) {
            const validCommand: boolean = this.commandExecutionService.interpretCommand(body);
            if (validCommand) {
                this.chatService.addMessage(body, 'ME');
            }
        }
        // this.getMessages();
        this.myForm.reset();
    }
}
