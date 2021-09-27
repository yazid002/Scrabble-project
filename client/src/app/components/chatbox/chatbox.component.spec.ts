import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatService } from '@app/services/chat.service';
import { CommandExecutionService } from '@app/services/command-execution/command-execution.service';

import { ChatboxComponent } from './chatbox.component';

describe('ChatboxComponent', () => {
    let component: ChatboxComponent;
    let fixture: ComponentFixture<ChatboxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatboxComponent],
            providers: [CommandExecutionService, ChatService],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should detect an error if an invalid command is in inputBox property', () => {
        component.inputBox = '!invalide';
        component.validateFormat();
        expect(component.error).toBeTrue();
    });
    it('should not have any errors if a valid command is entered', () => {
        component.inputBox = '!debug';
        component.validateFormat();
        expect(component.error).toBeFalse();
    });
    it('should add a message to the message list onSubmit', () => {
        component.inputBox = 'Une valeur';
        const numMessageInit: number = component.messages.length;
        component.onSubmit();
        expect(component.messages.length).toEqual(numMessageInit + 1);
    });
    it('should add two messages to the message list onSubmit if input is a command', () => {
        component.inputBox = '!resersve';
        const numMessageInit: number = component.messages.length;
        component.onSubmit();
        expect(component.messages.length).toEqual(numMessageInit + 2);
    });
});
