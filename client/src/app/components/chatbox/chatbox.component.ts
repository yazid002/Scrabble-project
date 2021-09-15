import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '@app/chat.service';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
    myForm: FormGroup;
    minLength: number = 5;
    maxLength:number = 25;
    constructor(public chatService: ChatService, private fb: FormBuilder) {}

    ngOnInit(): void {
        this.myForm = this.fb.group({
            message: ['', [Validators.required, Validators.minLength(this.minLength), Validators.maxLength(this.maxLength)]],
        });
        this.myForm.valueChanges.subscribe(/*console.log*/);
    }
    get message() {
        let message = this.myForm.get('message');
        console.log("message min length:");
        console.log(message?.errors?.minlength);
        return message;
    }
}
